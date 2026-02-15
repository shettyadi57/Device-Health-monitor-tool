# Device-Health-monitor-tool
# 🖥️ Device Health Monitor

A centralized system monitoring solution that tracks computer health, resource usage, and software activity across multiple machines in real time.

This project provides administrators with a single dashboard to monitor CPU, RAM, disk usage, and active application usage from connected devices within a lab or office network.

---

# 🚀 Features

## 🔍 Real-Time System Monitoring

* CPU usage tracking
* RAM utilization monitoring
* Disk usage statistics
* Live device status updates
* Online / Offline detection

## 💻 Software Usage Tracking

* Active application detection
* Software usage duration calculation
* Productivity insights
* Usage analytics per device

## 📡 Centralized Dashboard

* Monitor multiple PCs from one interface
* Real-time data updates
* Device detail view
* Resource usage visualization
* Admin monitoring panel

## ⚙️ Lightweight Monitoring Agent

* Runs in background with minimal resources
* Automatic device identification using hostname
* Periodic reporting to server
* Easy deployment across multiple machines

## 🔐 Secure Communication Ready

* REST API architecture
* Device-based identification
* Expandable authentication support

---

# 🏗️ System Architecture

```
+-------------------+
|   Client Devices  |
| (Monitoring Agent)|
+---------+---------+
          |
          | HTTP Requests (JSON)
          |
+---------v---------+
|   Backend Server  |
|   Flask API       |
+---------+---------+
          |
          |
+---------v---------+
|   Web Dashboard   |
|   Admin Interface |
+-------------------+
```

---

# 🛠️ Technologies Used

* Python
* Flask
* psutil
* Requests
* HTML / CSS / JavaScript
* Windows API (pywin32)
* REST API Architecture

---

# 📂 Project Structure

```
device-health-monitor/
│── app.py              # Flask backend server
│── agent.py            # Client monitoring agent
│── requirements.txt
│
├── templates/
│     └── index.html    # Dashboard UI
│
├── static/
│     ├── style.css
│     └── script.js
│
└── README.md
```

---

# ⚡ Installation Guide

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/device-health-monitor.git
cd device-health-monitor
```

## 2️⃣ Install Dependencies

```
pip install -r requirements.txt
```

Or install manually:

```
pip install flask psutil requests pywin32
```

## 3️⃣ Run Server

```
python app.py
```

Server will start at:

```
http://127.0.0.1:5000
```

## 4️⃣ Run Agent (Client Device)

```
python agent.py
```

---

# 🌐 Multi-Device Deployment

1. Start server on admin computer.
2. Find server IP:

```
ipconfig
```

3. Update agent configuration:

```
SERVER_URL = "http://SERVER_IP:5000/report"
```

4. Run agent on each machine.

---

# 📈 Recent Updates

* Real-time monitoring system implemented
* Software usage tracking added
* Multi-device support enabled
* Improved dashboard UI
* Network error handling improvements
* Background agent optimization

---

# 🔮 Future Enhancements

* Database integration (PostgreSQL / MongoDB)
* Authentication system (Admin login)
* Advanced analytics dashboard
* Auto-start agent on boot
* Agent executable (.exe) installer
* Cross-platform support (Linux / macOS)
* Alert system for abnormal resource usage

---

# 🎯 Use Cases

* Computer labs
* Office IT monitoring
* Educational institutions
* Small data centers
* Cyber cafes

---

# 👨‍💻 Author

**Adithya S Shetty**
BCA Student | Developer | Tech Enthusiast

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!

---
