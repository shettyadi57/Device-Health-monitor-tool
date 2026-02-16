from flask import Flask, jsonify, render_template
import psutil
import socket

app = Flask(__name__)

device_name = socket.gethostname()

def get_system_data():
    return {
        "device": device_name,
        "cpu": psutil.cpu_percent(interval=1),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "battery": psutil.sensors_battery().percent if psutil.sensors_battery() else None
    }

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/metrics")
def metrics():
    return jsonify(get_system_data())

if __name__ == "__main__":
    app.run(debug=True)
