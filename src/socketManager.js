const { connectToServer } = require('./sshManager');
const { pingOtherServers } = require('./pingService');
const { insertPing, getLastPings } = require('./db');
let servers = require('../config/servers.json');

async function setupPing(io) {
    const connections = {};

    async function initConnections() {
        for (const server of servers) {
            try {
                const conn = await connectToServer(server);
                connections[server.name] = conn;
            } catch (error) {
                console.error(\`Failed to connect to \${server.name}:\`, error.message);
            }
        }
    }

    await initConnections();

    io.on('connection', async (socket) => {
        console.log('Client connected');
        try {
            const rows = await getLastPings();
            const formatted = rows.map(row => ({
                source: row.source,
                target: row.target,
                success: row.success === 1,
                time: row.time,
                timestamp: row.timestamp
            }));
            socket.emit('initialData', formatted);
        } catch (err) {
            console.error('DB Read Error:', err.message);
        }
    });

    setInterval(async () => {
        servers = require('../config/servers.json');

        for (const [serverName, conn] of Object.entries(connections)) {
            const otherServers = servers.filter(s => s.name !== serverName);
            try {
                const results = await pingOtherServers(conn, otherServers);
                const timestamp = new Date();
                results.forEach(r => {
                    insertPing({
                        source: serverName,
                        target: r.target,
                        success: r.success,
                        time: r.time,
                        timestamp: timestamp.toISOString()
                    });
                });

                io.emit('pingResults', {
                    server: serverName,
                    results,
                    timestamp
                });
            } catch (error) {
                console.error(\`Ping error from \${serverName}:\`, error.message);
            }
        }
    }, 10000);
}

module.exports = { setupPing };
