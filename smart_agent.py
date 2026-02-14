import psutil
import requests
import socket
import time
import win32gui
import win32api
import win32con 
from collections import defaultdict
from datetime import datetime

# =============================
# CONFIGURATION
# =============================

SERVER_URL = "http://192.168.1.10:5000/report"  # CHANGE to Admin PC IP
API_KEY = "LAB_SECRET_123"

SEND_INTERVAL = 30  # seconds

# =============================
# DEVICE INFO
# =============================

DEVICE_NAME = socket.gethostname()
usage_data = defaultdict(int)

last_app = None
app_start_time = time.time()

# =============================
# GET ACTIVE WINDOW TITLE
# =============================

def get_active_window():
    window = win32gui.GetForegroundWindow()
    return win32gui.GetWindowText(window)

# =============================
# CHECK IF USER IS IDLE
# =============================

def get_idle_duration():
    class LASTINPUTINFO:
        cbSize = 8
        dwTime = 0

    liinfo = LASTINPUTINFO()
    win32api.GetLastInputInfo()
    millis = win32api.GetTickCount() - liinfo.dwTime
    return millis / 1000.0

# =============================
# COLLECT SYSTEM METRICS
# =============================

def collect_system_metrics():
    return {
        "cpu": psutil.cpu_percent(interval=1),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('C:\\').percent,
        "battery": psutil.sensors_battery().percent if psutil.sensors_battery() else None
    }

# =============================
# TRACK APP USAGE
# =============================

def update_app_usage():
    global last_app, app_start_time

    current_app = get_active_window()

    if current_app != last_app:
        if last_app:
            duration = time.time() - app_start_time
            usage_data[last_app] += duration

        last_app = current_app
        app_start_time = time.time()

# =============================
# SEND DATA TO SERVER
# =============================

def send_data():
    metrics = collect_system_metrics()

    payload = {
        "device": DEVICE_NAME,
        "timestamp": str(datetime.now()),
        "metrics": metrics,
        "usage": dict(usage_data)
    }

    headers = {
        "Authorization": API_KEY
    }

    try:
        requests.post(SERVER_URL, json=payload, headers=headers, timeout=5)
        print("Data sent successfully.")
    except Exception as e:
        print("Server not reachable:", e)

# =============================
# MAIN LOOP
# =============================

print(f"Smart Agent Running on {DEVICE_NAME}")

while True:
    update_app_usage()
    time.sleep(1)

    if int(time.time()) % SEND_INTERVAL == 0:
        send_data()
