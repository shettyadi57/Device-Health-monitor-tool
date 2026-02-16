import psutil
import time
import requests
import socket

SERVER_URL = "http://127.0.0.1:5000/report"

device_id = socket.gethostname()

while True:
    try:
        data = {
            "device_id": device_id,
            "cpu": psutil.cpu_percent(interval=1),
            "ram": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage('/').percent
        }

        response = requests.post(SERVER_URL, json=data)
        print("Sent:", response.status_code)

    except Exception as e:
        print("Server not reachable:", e)

    time.sleep(5)
