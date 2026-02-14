from flask import Flask, request, jsonify

app = Flask(__name__)

devices = {}

@app.route("/")
def home():
    return "Server Running Successfully ✅"


@app.route("/report", methods=["POST"])
def report():
    data = request.json
    device_id = data.get("device_id")

    devices[device_id] = data

    return {"status": "received"}


@app.route("/devices")
def get_devices():
    return jsonify(devices)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
