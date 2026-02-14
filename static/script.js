// script.js - Device Health Monitor
class DeviceMonitor {
    constructor() {
        this.devices = {};
        this.currentView = 'devices';
        this.selectedDevice = null;
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.startAutoRefresh();
        this.loadDevices();
    }

    cacheDOM() {
        this.content = document.getElementById('content');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.backBtn = document.getElementById('backBtn');
        this.pageTitle = document.getElementById('pageTitle');
        this.timestamp = document.getElementById('timestamp');
        this.refreshStatus = document.getElementById('refreshStatus');
    }

    bindEvents() {
        this.backBtn.addEventListener('click', () => this.showDeviceList());
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view === 'details') {
                this.showDeviceDetails(e.state.deviceName, false);
            } else {
                this.showDeviceList(false);
            }
        });
    }

    startAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set new interval
        this.refreshInterval = setInterval(() => {
            if (this.currentView === 'devices') {
                this.loadDevices(true);
            } else if (this.currentView === 'details' && this.selectedDevice) {
                this.loadDeviceDetails(this.selectedDevice, true);
            }
        }, 3000);
    }

    async loadDevices(silent = false) {
        if (!silent) this.showLoading();
        
        try {
            const response = await fetch('/devices');
            if (!response.ok) throw new Error('Failed to fetch devices');
            
            this.devices = await response.json();
            this.renderDeviceList();
            this.updateTimestamp();
            
        } catch (error) {
            console.error('Error loading devices:', error);
            this.showError('Failed to load devices. Please check your connection.');
        } finally {
            if (!silent) this.hideLoading();
        }
    }

    async loadDeviceDetails(deviceName, silent = false) {
        if (!silent) this.showLoading();
        
        try {
            // In a real app, you might have a specific endpoint for single device
            // For now, we'll filter from the full list
            const response = await fetch('/devices');
            if (!response.ok) throw new Error('Failed to fetch device details');
            
            const devices = await response.json();
            const deviceData = devices[deviceName];
            
            if (!deviceData) throw new Error('Device not found');
            
            this.renderDeviceDetails(deviceName, deviceData);
            this.updateTimestamp();
            
        } catch (error) {
            console.error('Error loading device details:', error);
            this.showError('Failed to load device details.');
        } finally {
            if (!silent) this.hideLoading();
        }
    }

    renderDeviceList() {
        const devices = this.devices;
        
        if (Object.keys(devices).length === 0) {
            this.content.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 64px;">🖥️</div>
                    <p>No devices connected</p>
                </div>
            `;
            return;
        }

        let html = '<div class="device-grid">';
        
        for (const [deviceName, data] of Object.entries(devices)) {
            const lastUpdated = new Date().toLocaleTimeString();
            
            html += `
                <div class="device-card" onclick="app.showDeviceDetails('${deviceName}')">
                    <div class="device-header">
                        <span class="device-name">
                            <span>💻</span>
                            ${deviceName}
                        </span>
                        <span class="device-status">
                            <span class="status-indicator"></span>
                            Online
                        </span>
                    </div>
                    <div class="device-preview">
                        <div class="preview-item">
                            <div class="preview-label">CPU</div>
                            <div class="preview-value">${data.cpu || 0}%</div>
                        </div>
                        <div class="preview-item">
                            <div class="preview-label">RAM</div>
                            <div class="preview-value">${data.ram || 0}%</div>
                        </div>
                        <div class="preview-item">
                            <div class="preview-label">Disk</div>
                            <div class="preview-value">${data.disk || 0}%</div>
                        </div>
                    </div>
                    <div class="device-footer">
                        <span>🕒 Last updated: ${lastUpdated}</span>
                        <span>📊 View details →</span>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        this.content.innerHTML = html;
        
        // Update UI state
        this.currentView = 'devices';
        this.pageTitle.textContent = 'Device Dashboard';
        this.backBtn.style.display = 'none';
        
        // Update browser history
        history.pushState({ view: 'devices' }, '', '/');
    }

    renderDeviceDetails(deviceName, data) {
        const lastUpdated = new Date().toLocaleTimeString();
        
        // Format software usage
        let softwareHtml = '';
        if (data.usage && Object.keys(data.usage).length > 0) {
            for (const [app, minutes] of Object.entries(data.usage)) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                
                softwareHtml += `
                    <div class="software-item">
                        <span class="software-name">
                            <span>📱</span>
                            ${app.replace('.exe', '')}
                        </span>
                        <span class="software-time">${timeString}</span>
                    </div>
                `;
            }
        } else {
            softwareHtml = '<div class="empty-state">No active software</div>';
        }

        const detailsHtml = `
            <div class="device-details">
                <div class="details-header">
                    <span class="details-icon">💻</span>
                    <div class="details-title">
                        <h2>${deviceName}</h2>
                        <p>
                            <span class="status-dot live"></span>
                            Online · Last updated ${lastUpdated}
                        </p>
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-icon">⚡</span>
                            <h3>CPU Usage</h3>
                        </div>
                        <div class="metric-value">${data.cpu || 0}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.cpu || 0}%"></div>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-icon">🧠</span>
                            <h3>RAM Usage</h3>
                        </div>
                        <div class="metric-value">${data.ram || 0}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.ram || 0}%"></div>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-icon">💾</span>
                            <h3>Disk Usage</h3>
                        </div>
                        <div class="metric-value">${data.disk || 0}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.disk || 0}%"></div>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-icon">🔋</span>
                            <h3>Battery</h3>
                        </div>
                        <div class="metric-value">${data.battery || 'N/A'}${data.battery ? '%' : ''}</div>
                        ${data.battery ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${data.battery}%"></div>
                        </div>
                        ` : '<div style="height: 8px;"></div>'}
                    </div>
                </div>

                <div class="software-section">
                    <h3 class="section-title">
                        <span>📊</span>
                        Active Software Usage
                    </h3>
                    <div class="software-list">
                        ${softwareHtml}
                    </div>
                </div>
            </div>
        `;

        this.content.innerHTML = detailsHtml;
        
        // Update UI state
        this.currentView = 'details';
        this.selectedDevice = deviceName;
        this.pageTitle.textContent = 'Device Details';
        this.backBtn.style.display = 'block';
        
        // Update browser history
        history.pushState({ view: 'details', deviceName: deviceName }, '', `/device/${deviceName}`);
    }

    showDeviceDetails(deviceName, updateHistory = true) {
        this.selectedDevice = deviceName;
        this.loadDeviceDetails(deviceName);
        
        if (updateHistory) {
            history.pushState({ view: 'details', deviceName: deviceName }, '', `/device/${deviceName}`);
        }
    }

    showDeviceList(updateHistory = true) {
        this.selectedDevice = null;
        this.loadDevices();
        
        if (updateHistory) {
            history.pushState({ view: 'devices' }, '', '/');
        }
    }

    showLoading() {
        this.loadingOverlay.classList.add('active');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('active');
    }

    showError(message) {
        // You could enhance this with a toast notification
        console.error(message);
    }

    updateTimestamp() {
        const now = new Date();
        this.timestamp.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }
}

// Initialize app
const app = new DeviceMonitor();

// Make app accessible globally for onclick handlers
window.app = app;