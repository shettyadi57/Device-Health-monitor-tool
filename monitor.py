import psutil
import time

while True:
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    print("CPU Usage:", cpu, "%")
    print("RAM Usage:", ram, "%")
    print("Disk Usage:", disk, "%")
    print("----------------------------")
