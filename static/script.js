    /**
 * Device Health Monitor – dynamic stats updater
 * Updates CPU, RAM and Disk values + progress bars.
 */
(function() {
    "use strict";

    // DOM references
    const cpuPercentEl = document.getElementById('cpuPercent');
    const ramPercentEl = document.getElementById('ramPercent');
    const diskPercentEl = document.getElementById('diskPercent');

    const cpuFillEl = document.getElementById('cpuFill');
    const ramFillEl = document.getElementById('ramFill');
    const diskFillEl = document.getElementById('diskFill');

    const timestampEl = document.querySelector('.timestamp');

    /**
     * Update all dashboard stats with smooth progress bar animation.
     * @param {number} cpu  - CPU usage percentage (0–100)
     * @param {number} ram  - RAM usage percentage (0–100)
     * @param {number} disk - Disk usage percentage (0–100)
     */
    function updateStats(cpu, ram, disk) {
        // clamp values between 0 and 100
        cpu = Math.min(100, Math.max(0, Number(cpu) || 0));
        ram = Math.min(100, Math.max(0, Number(ram) || 0));
        disk = Math.min(100, Math.max(0, Number(disk) || 0));

        // update percentage text
        if (cpuPercentEl) cpuPercentEl.textContent = `${Math.round(cpu)}%`;
        if (ramPercentEl) ramPercentEl.textContent = `${Math.round(ram)}%`;
        if (diskPercentEl) diskPercentEl.textContent = `${Math.round(disk)}%`;

        // update progress bar width (style already transitioned via CSS)
        if (cpuFillEl) cpuFillEl.style.width = `${cpu}%`;
        if (ramFillEl) ramFillEl.style.width = `${ram}%`;
        if (diskFillEl) diskFillEl.style.width = `${disk}%`;

        // refresh timestamp (human readable)
        if (timestampEl) {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timestampEl.textContent = `updated ${formattedTime}`;
        }
    }

    // ------------------------------------------------------
    // Simulate live system monitoring – random updates every 3s
    // In production, replace this with real data source.
    // ------------------------------------------------------
    function initRandomUpdates() {
        // initial call with realistic default values (already visible in html)
        // but we enforce them via updateStats to sync timestamp & bars
        updateStats(45, 32, 78);

        // periodic update to mimic real-time telemetry
        setInterval(() => {
            const randomCpu = Math.floor(Math.random() * (85 - 20 + 1) + 20);  // 20–85%
            const randomRam = Math.floor(Math.random() * (70 - 25 + 1) + 25);  // 25–70%
            const randomDisk = Math.floor(Math.random() * (92 - 50 + 1) + 50); // 50–92%

            updateStats(randomCpu, randomRam, randomDisk);
        }, 3000);
    }

    // expose updateStats globally (available for external calls / console)
    window.updateStats = updateStats;

    // start live simulation when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRandomUpdates);
    } else {
        initRandomUpdates(); // DOM already ready
    }
})();
async function fetchData() {
    try {
        const response = await fetch("/system");
        const data = await response.json();

        document.getElementById("cpu-value").innerText = data.cpu + "%";
        document.getElementById("ram-value").innerText = data.ram + "%";
        document.getElementById("disk-value").innerText = data.disk + "%";

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call immediately
fetchData();

// Repeat every 2 seconds
setInterval(fetchData, 2000);
