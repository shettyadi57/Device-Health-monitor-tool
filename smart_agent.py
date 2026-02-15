import psutil
import time
import socket
import requests
from collections import defaultdict

# Windows active window tracking
import win32gui
import win32process

SERVER_URL = "http://127.0.0.1:5001/report"


device_id = socket.gethostname()

usage_time = defaultdict(int)


def get_active_app():
    try:
        window = win32gui.GetForegroundWindow()
        _, pid = win32process.GetWindowThreadProcessId(window)
        process = psutil.Process(pid)
        return process.name()
    except:
        return "Unknown"


while True:
    cpu = psutil.cpu_percent()
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    # Active software tracking
    app = get_active_app()
    usage_time[app] += 5   # seconds

    data = {
        "device_id": device_id,
        "cpu": cpu,
        "ram": ram,
        "disk": disk,
        "usage": dict(usage_time)
    }

    try:
      response = requests.post(SERVER_URL, json=data)
      print("Sent successfully:", response.status_code)
    except Exception as e:
     print("Error:", e)
