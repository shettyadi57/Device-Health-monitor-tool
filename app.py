from flask import Flask, jsonify, render_template
import psutil

# ✅ First create app
app = Flask(__name__)

# ✅ Then define routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/system")
def system_data():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    
    return jsonify({
        "cpu": cpu,
        "ram": ram,
        "disk": disk
    })

# ✅ Run app at the end
if __name__ == "__main__":
    app.run(debug=True)
  