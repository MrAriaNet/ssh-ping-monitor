const { Client } = require('ssh2');

function connectToServer(serverConfig) {
    const conn = new Client();
    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            console.log(\`Connected to \${serverConfig.name}\`);
            resolve(conn);
        }).on('error', (err) => {
            console.error(\`Connection error to \${serverConfig.name}:\`, err.message);
            reject(err);
        }).connect({
            host: serverConfig.host,
            port: serverConfig.port,
            username: serverConfig.username,
            password: serverConfig.password,
            readyTimeout: 10000
        });
    });
}

module.exports = { connectToServer };
