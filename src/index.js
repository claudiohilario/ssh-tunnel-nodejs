const net = require('net');
const { Client } = require('ssh2');

const constants = require('./constants');

/**
 * Handle ssh success connection.
 * 
 * @param {object} options - The options;
 * @param {string} options.host - The remote host.
 * @param {number} options.port - The remote port.
 * @param {object} sshClient - The sshClient.
 * @param {object} resolve  - The resolve promise callback function.
 */
function handleSshClientReady(options, sshClient, resolve) {
    const server = net.createServer(function(socket) {
        sshClient.forwardOut(socket.remoteAddress, socket.remotePort, options.host, options.port, (error, stream) => {
            if(error) {
                return socket.end();
            }
            return socket.pipe(stream).pipe(socket);
        });

    }).listen(0, function() {
        return resolve({
            host: constants.LOCALHOST_IP,
            port: server.address().port
        });
    });
}

/**
 * Handle ssh connection error.
 * 
 * @param {object} reject - The reject promise callback function;
 * @param {object} error  - The error.
 */
function handleSshClientError(reject, error) {
    return reject(error);
}

/**
 * Gets host and port to connect remote server.
 * 
 * Example access redis on server 192.168.20.10
 * 
 * @example
 * const options = {
 *  host: '127.0.0.1'
 *  port: 6379,
 * 
 *  sshHost: '192.168.20.10',
 *  sshPort: 22,
 *  sshUser: 'root',
 *  sshPassword: 'password'
 * }
 * 
 * const localTunnelData = await getTunnelSSH(options);
 * 
 * @param {object} options - The all options.
 * @param {string} options.host - The host.
 * @param {number} options.port - The host Port.
 * 
 * @param {string} options.sshHost - The host.
 * @param {number} options.sshPort - The ssh port.
 * @param {string} options.sshUser - The ssh user.
 * @param {string} options.sshPassword - The ssh password.
 * @param {string} options.sshKey - The ssh private key.
 * 
 * @param {Object} - Returns local host and port to connect service by tunnel.
 * E.g.: { host: '127.0.0.1', port: 56051 }
 */
module.exports = function getTunnelSSH(options) {
    return new Promise(function(resolve, reject) {
        const sshClient = new Client()

        sshClient.on(constants.events.READY, handleSshClientReady.bind(null, options, sshClient, resolve));
        sshClient.on(constants.events.ERROR, handleSshClientError.bind(null, reject));

        try {
            const sshConnectionConfig = {
                host: options.sshHost,
                port: options.sshPort,
                username: options.sshUser,
            }

            if(options.sshKey) {
                return sshClient.connect({
                    ...sshConnectionConfig,
                    ...{ 
                        privateKey: options.sshKey,
                        passphrase: options.sshKeyPassphrase
                    }
                });
            }

            return sshClient.connect({
                ...sshConnectionConfig,
                ... {
                    password: options.sshPassword
                }
            })

        } catch(error) {
            return reject(error);
        }
    });
}

