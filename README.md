# SSH Tunnel with nodejs

## Usage example

### Auth with password
```js
    const const getTunnelSSH = require('./index');

    const options = {
        host: '127.0.0.1',
        port: 6379,
        sshHost: 'vps.example.com',
        sshPort: 22,
        sshUser: 'root',
        sshPassword: 'password',
    }

    const localTunnelData = await getTunnelSSH(options); //{ host: '127.0.0.1', port: 56215 }
```
### Auth with key

```js
    const const getTunnelSSH = require('./index');

    const options = {
        host: '127.0.0.1',
        port: 6379,
        sshHost: 'vps.example.com',
        sshPort: 22,
        sshUser: 'root',
        sshKey: '',
        sshKeyPassphrase: '',
    }

    const localTunnelData = await getTunnelSSH(options); //{ host: '127.0.0.1', port: 56215 }
```