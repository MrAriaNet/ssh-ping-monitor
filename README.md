# SSH Ping Monitor (Live Dashboard)

A live monitoring system that connects to multiple remote servers via SSH, pings other servers from each server, stores results in a SQLite database, and displays them in a real-time web dashboard with alerts on failure.

---

## Features

- Connect to multiple servers via SSH (username/password + custom SSH ports)
- Live ping between servers
- Store all ping results in a local **SQLite** database
- Real-time live updates of ping results
- Interactive table displaying source server, target server, status, and ping time
- Live updating **line chart** (Ping time history)
- **Alert notification** when a ping fails
- Success and Fail counters
- Fast loading: when a user connects, recent data from database is instantly shown (no waiting)

---

## Technologies Used

- Node.js
- Express.js
- Socket.io
- SQLite3
- Chart.js (for chart visualization)
- SSH2 (for SSH connections)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MrAriaNet/ssh-ping-monitor.git
cd ssh-ping-monitor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Servers

Edit the file `config/servers.json` and define your servers:

```json
[
  {
    "name": "Server A",
    "host": "10.0.0.1",
    "port": 2222,
    "username": "ubuntu",
    "password": "passwordA"
  },
  {
    "name": "Server B",
    "host": "10.0.0.2",
    "port": 2200,
    "username": "admin",
    "password": "passwordB"
  }
]
```

✅ You can add more servers by simply adding more entries.

> **Note:** Ensure that the servers allow SSH login with username and password.

---

### 4. Run the Application

```bash
npm start
```

Server will start at:

```
http://localhost:3000
```

If you deploy to a server, adjust your firewall and reverse proxy settings (e.g., using nginx) accordingly.

---

## How It Works

- The application connects to all configured servers via SSH.
- Each server pings other servers once every 10 seconds.
- The ping results (success or fail, and ping time) are stored in a **SQLite database** (`ping_data.db`).
- When a user connects to the dashboard:
  - Last 100 ping records are immediately loaded from database into table and chart.
  - New live ping results continue updating the dashboard.
- When a ping fails, an **alert message** appears at the top of the page for a few seconds.

---

## License

MIT License
