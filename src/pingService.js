function pingOtherServers(conn, targets) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completed = 0;

        targets.forEach(target => {
            const cmd = \`ping -c 1 \${target.host}\`;
            conn.exec(cmd, (err, stream) => {
                if (err) {
                    results.push({ target: target.name, success: false, time: null });
                    checkDone();
                    return;
                }

                let output = '';
                stream.on('close', (code) => {
                    if (code === 0) {
                        const match = output.match(/time=(\d+\.\d+) ms/);
                        const time = match ? parseFloat(match[1]) : null;
                        results.push({ target: target.name, success: true, time });
                    } else {
                        results.push({ target: target.name, success: false, time: null });
                    }
                    checkDone();
                }).on('data', (data) => {
                    output += data.toString();
                }).stderr.on('data', (data) => {
                    output += data.toString();
                });
            });
        });

        function checkDone() {
            completed++;
            if (completed === targets.length) {
                resolve(results);
            }
        }
    });
}

module.exports = { pingOtherServers };
