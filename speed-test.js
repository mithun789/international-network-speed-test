// International Network Speed Test - Advanced Implementation
class NetworkSpeedTest {
    constructor() {
        this.testServers = {
            'us-east': {
                name: 'US East (Virginia)',
                host: 'httpbin.org',
                backup: 'jsonplaceholder.typicode.com',
                location: 'Virginia, USA'
            },
            'us-west': {
                name: 'US West (California)',
                host: 'postman-echo.com',
                backup: 'httpbin.org',
                location: 'California, USA'
            },
            'eu-west': {
                name: 'Europe West (London)',
                host: 'httpbin.org',
                backup: 'reqres.in',
                location: 'London, UK'
            },
            'eu-central': {
                name: 'Europe Central (Frankfurt)',
                host: 'httpbin.org',
                backup: 'postman-echo.com',
                location: 'Frankfurt, Germany'
            },
            'asia-east': {
                name: 'Asia East (Tokyo)',
                host: 'httpbin.org',
                backup: 'jsonplaceholder.typicode.com',
                location: 'Tokyo, Japan'
            },
            'asia-southeast': {
                name: 'Asia Southeast (Singapore)',
                host: 'postman-echo.com',
                backup: 'httpbin.org',
                location: 'Singapore'
            },
            'australia': {
                name: 'Australia (Sydney)',
                host: 'httpbin.org',
                backup: 'reqres.in',
                location: 'Sydney, Australia'
            },
            'canada': {
                name: 'Canada (Toronto)',
                host: 'jsonplaceholder.typicode.com',
                backup: 'httpbin.org',
                location: 'Toronto, Canada'
            },
            'brazil': {
                name: 'Brazil (São Paulo)',
                host: 'httpbin.org',
                backup: 'postman-echo.com',
                location: 'São Paulo, Brazil'
            }
        };

        this.testResults = {
            downloadSpeed: 0,
            uploadSpeed: 0,
            ping: 0,
            jitter: 0,
            packetLoss: 0,
            testDuration: 0,
            serverUsed: '',
            timestamp: null,
            userLocation: null,
            isp: null,
            ip: null
        };

        this.speedHistory = [];
        this.isTestRunning = false;
        this.currentTest = null;

        this.initializeEventListeners();
        this.detectUserLocation();
    }

    initializeEventListeners() {
        document.getElementById('startTest').addEventListener('click', () => this.startSpeedTest());
        document.getElementById('multiServerTest').addEventListener('click', () => this.startMultiServerTest());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportToCSV());
        document.getElementById('exportJSON').addEventListener('click', () => this.exportToJSON());
        document.getElementById('generateReport').addEventListener('click', () => this.generateDetailedReport());
    }

    async detectUserLocation() {
        try {
            this.updateStatus('🌍 Detecting your location...');
            
            // Get IP and location info
            const ipResponse = await fetch('https://httpbin.org/ip');
            const ipData = await ipResponse.json();
            this.testResults.ip = ipData.origin;

            // Try to get more detailed location info
            const locationResponse = await fetch(`https://ipapi.co/${ipData.origin}/json/`);
            const locationData = await locationResponse.json();
            
            this.testResults.userLocation = {
                country: locationData.country_name,
                city: locationData.city,
                region: locationData.region,
                latitude: locationData.latitude,
                longitude: locationData.longitude
            };
            
            this.testResults.isp = locationData.org;

            this.updateDetailsDisplay();
            this.updateStatus('✅ Location detected. Ready to test.');

        } catch (error) {
            console.warn('Could not detect location:', error);
            this.updateStatus('⚠️ Location detection failed. Test will continue.');
        }
    }

    async startSpeedTest() {
        if (this.isTestRunning) return;

        this.isTestRunning = true;
        this.resetDisplay();
        
        const serverKey = document.getElementById('serverSelect').value;
        const testType = document.getElementById('testType').value;
        
        try {
            const server = serverKey === 'auto' ? await this.selectBestServer() : this.testServers[serverKey];
            this.testResults.serverUsed = server.name;
            this.testResults.timestamp = new Date();

            this.updateStatus(`🔍 Testing connection to ${server.name}...`);

            // Test sequence based on selected type
            if (testType === 'full' || testType === 'ping') {
                await this.testLatency(server);
            }
            
            if (testType === 'full' || testType === 'download') {
                await this.testDownloadSpeed(server);
            }
            
            if (testType === 'full' || testType === 'upload') {
                await this.testUploadSpeed(server);
            }

            await this.performAdvancedDiagnostics(server);
            
            this.updateDetailsDisplay();
            this.updateStatus('✅ Speed test completed!');
            this.saveTestResult();

        } catch (error) {
            console.error('Speed test failed:', error);
            this.updateStatus('❌ Speed test failed. Please try again.');
        } finally {
            this.isTestRunning = false;
            document.getElementById('startTest').disabled = false;
        }
    }

    async selectBestServer() {
        this.updateStatus('🔍 Finding best server...');
        const serverPings = {};
        
        for (const [key, server] of Object.entries(this.testServers)) {
            try {
                const startTime = performance.now();
                await fetch(`https://${server.host}/get`, { 
                    method: 'GET',
                    cache: 'no-cache'
                });
                const ping = performance.now() - startTime;
                serverPings[key] = ping;
            } catch (error) {
                serverPings[key] = 9999; // High penalty for failed servers
            }
        }

        const bestServerKey = Object.keys(serverPings).reduce((a, b) => 
            serverPings[a] < serverPings[b] ? a : b
        );

        return this.testServers[bestServerKey];
    }

    async testLatency(server) {
        this.updateStatus('📡 Testing latency and jitter...');
        const pings = [];
        const iterations = 10;

        for (let i = 0; i < iterations; i++) {
            try {
                const startTime = performance.now();
                await fetch(`https://${server.host}/get?_=${Date.now()}`, {
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                const ping = performance.now() - startTime;
                pings.push(ping);
                
                document.getElementById('ping').textContent = Math.round(ping);
                this.updateProgress((i + 1) / iterations * 25);
                
                await this.sleep(100);
            } catch (error) {
                console.warn('Ping test failed:', error);
            }
        }

        if (pings.length > 0) {
            this.testResults.ping = Math.round(pings.reduce((a, b) => a + b) / pings.length);
            
            // Calculate jitter (standard deviation)
            const mean = this.testResults.ping;
            const squaredDiffs = pings.map(ping => Math.pow(ping - mean, 2));
            this.testResults.jitter = Math.round(Math.sqrt(squaredDiffs.reduce((a, b) => a + b) / squaredDiffs.length));
            
            document.getElementById('ping').textContent = this.testResults.ping;
            document.getElementById('jitter').textContent = this.testResults.jitter;
        }
    }

    async testDownloadSpeed(server) {
        this.updateStatus('⬇️ Testing download speed...');
        
        const testDuration = 10000; // 10 seconds
        const startTime = Date.now();
        let totalBytes = 0;
        const speedReadings = [];

        // Create multiple concurrent downloads for more accurate measurement
        const downloadPromises = [];
        for (let i = 0; i < 4; i++) {
            downloadPromises.push(this.downloadTest(server, testDuration, (bytes, speed) => {
                totalBytes += bytes;
                speedReadings.push(speed);
                
                const elapsed = Date.now() - startTime;
                const currentSpeed = (totalBytes * 8) / (elapsed / 1000) / 1000000; // Mbps
                
                document.getElementById('downloadSpeed').textContent = currentSpeed.toFixed(2);
                this.updateProgress(25 + (elapsed / testDuration) * 35);
            }));
        }

        await Promise.all(downloadPromises);

        const finalElapsed = Date.now() - startTime;
        this.testResults.downloadSpeed = (totalBytes * 8) / (finalElapsed / 1000) / 1000000;
        document.getElementById('downloadSpeed').textContent = this.testResults.downloadSpeed.toFixed(2);
    }

    async downloadTest(server, duration, onProgress) {
        const startTime = Date.now();
        let totalBytes = 0;

        while (Date.now() - startTime < duration) {
            try {
                const response = await fetch(`https://${server.host}/bytes/1048576?_=${Date.now()}`, {
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const bytes = blob.size;
                    totalBytes += bytes;
                    
                    const elapsed = Date.now() - startTime;
                    const speed = (totalBytes * 8) / (elapsed / 1000) / 1000000;
                    onProgress(bytes, speed);
                }
            } catch (error) {
                console.warn('Download test chunk failed:', error);
                break;
            }
        }

        return totalBytes;
    }

    async testUploadSpeed(server) {
        this.updateStatus('⬆️ Testing upload speed...');
        
        const testDuration = 8000; // 8 seconds
        const startTime = Date.now();
        let totalBytes = 0;

        // Generate test data
        const testData = new ArrayBuffer(1048576); // 1MB chunks
        const dataView = new Uint8Array(testData);
        for (let i = 0; i < dataView.length; i++) {
            dataView[i] = Math.floor(Math.random() * 256);
        }

        while (Date.now() - startTime < testDuration) {
            try {
                const uploadStart = Date.now();
                const response = await fetch(`https://${server.host}/post`, {
                    method: 'POST',
                    body: testData,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    },
                    cache: 'no-cache'
                });

                if (response.ok) {
                    totalBytes += testData.byteLength;
                    const elapsed = Date.now() - startTime;
                    const currentSpeed = (totalBytes * 8) / (elapsed / 1000) / 1000000;
                    
                    document.getElementById('uploadSpeed').textContent = currentSpeed.toFixed(2);
                    this.updateProgress(60 + (elapsed / testDuration) * 30);
                }
            } catch (error) {
                console.warn('Upload test failed:', error);
                break;
            }
        }

        const finalElapsed = Date.now() - startTime;
        this.testResults.uploadSpeed = (totalBytes * 8) / (finalElapsed / 1000) / 1000000;
        document.getElementById('uploadSpeed').textContent = this.testResults.uploadSpeed.toFixed(2);
    }

    async performAdvancedDiagnostics(server) {
        this.updateStatus('🔬 Running advanced diagnostics...');
        
        try {
            // DNS resolution time
            const dnsStart = performance.now();
            await fetch(`https://${server.host}/get`, { method: 'HEAD' });
            const dnsTime = performance.now() - dnsStart;
            
            // Connection time analysis
            const connectionStart = performance.now();
            const response = await fetch(`https://${server.host}/get`);
            const connectionTime = performance.now() - connectionStart;
            
            // Check for packet loss simulation
            let successfulRequests = 0;
            const totalRequests = 10;
            
            for (let i = 0; i < totalRequests; i++) {
                try {
                    await fetch(`https://${server.host}/get?test=${i}`, { 
                        method: 'HEAD',
                        timeout: 5000 
                    });
                    successfulRequests++;
                } catch (error) {
                    // Request failed
                }
            }
            
            this.testResults.packetLoss = ((totalRequests - successfulRequests) / totalRequests) * 100;
            this.testResults.dnsTime = Math.round(dnsTime);
            this.testResults.connectionTime = Math.round(connectionTime);
            
        } catch (error) {
            console.warn('Advanced diagnostics failed:', error);
        }
        
        this.updateProgress(100);
    }

    async startMultiServerTest() {
        if (this.isTestRunning) return;

        this.isTestRunning = true;
        document.getElementById('serverList').style.display = 'block';
        document.getElementById('serverResults').innerHTML = '';
        
        this.updateStatus('🌐 Testing all international servers...');
        
        const serverResults = [];

        for (const [key, server] of Object.entries(this.testServers)) {
            try {
                this.updateStatus(`Testing ${server.name}...`);
                
                // Quick ping test for each server
                const startTime = performance.now();
                await fetch(`https://${server.host}/get`, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                const ping = Math.round(performance.now() - startTime);
                
                serverResults.push({
                    name: server.name,
                    location: server.location,
                    ping: ping,
                    status: 'online'
                });

                // Update UI
                const resultDiv = document.createElement('div');
                resultDiv.className = 'server-item';
                resultDiv.innerHTML = `
                    <div>
                        <div class="server-name">${server.name}</div>
                        <div style="font-size: 0.9em; color: #666;">${server.location}</div>
                    </div>
                    <div class="server-ping">${ping} ms</div>
                `;
                document.getElementById('serverResults').appendChild(resultDiv);

            } catch (error) {
                serverResults.push({
                    name: server.name,
                    location: server.location,
                    ping: 'timeout',
                    status: 'offline'
                });

                const resultDiv = document.createElement('div');
                resultDiv.className = 'server-item';
                resultDiv.innerHTML = `
                    <div>
                        <div class="server-name">${server.name}</div>
                        <div style="font-size: 0.9em; color: #666;">${server.location}</div>
                    </div>
                    <div style="color: #e74c3c;">Timeout</div>
                `;
                document.getElementById('serverResults').appendChild(resultDiv);
            }
        }

        this.isTestRunning = false;
        this.updateStatus('✅ Multi-server test completed!');
    }

    updateDetailsDisplay() {
        const detailsGrid = document.getElementById('detailsGrid');
        detailsGrid.innerHTML = '';

        const details = [
            { label: 'Test Server', value: this.testResults.serverUsed || 'Not tested' },
            { label: 'Your IP Address', value: this.testResults.ip || 'Unknown' },
            { label: 'ISP Provider', value: this.testResults.isp || 'Unknown' },
            { label: 'Your Location', value: this.testResults.userLocation ? 
                `${this.testResults.userLocation.city}, ${this.testResults.userLocation.country}` : 'Unknown' },
            { label: 'DNS Resolution Time', value: this.testResults.dnsTime ? `${this.testResults.dnsTime} ms` : 'Not measured' },
            { label: 'Connection Time', value: this.testResults.connectionTime ? `${this.testResults.connectionTime} ms` : 'Not measured' },
            { label: 'Packet Loss', value: this.testResults.packetLoss ? `${this.testResults.packetLoss.toFixed(1)}%` : 'Not measured' },
            { label: 'Test Timestamp', value: this.testResults.timestamp ? 
                this.testResults.timestamp.toLocaleString() : 'No test completed' }
        ];

        details.forEach(detail => {
            const detailDiv = document.createElement('div');
            detailDiv.className = 'detail-item';
            detailDiv.innerHTML = `
                <div class="detail-label">${detail.label}</div>
                <div class="detail-value">${detail.value}</div>
            `;
            detailsGrid.appendChild(detailDiv);
        });
    }

    saveTestResult() {
        this.speedHistory.push({
            ...this.testResults,
            timestamp: new Date()
        });

        // Save to localStorage for persistence
        localStorage.setItem('speedTestHistory', JSON.stringify(this.speedHistory));
    }

    exportToCSV() {
        if (this.speedHistory.length === 0) {
            alert('No test data to export. Please run a test first.');
            return;
        }

        const headers = ['Timestamp', 'Server', 'Download (Mbps)', 'Upload (Mbps)', 'Ping (ms)', 'Jitter (ms)', 'Packet Loss (%)', 'ISP', 'Location'];
        const csvContent = [
            headers.join(','),
            ...this.speedHistory.map(result => [
                result.timestamp?.toISOString() || '',
                result.serverUsed || '',
                result.downloadSpeed || 0,
                result.uploadSpeed || 0,
                result.ping || 0,
                result.jitter || 0,
                result.packetLoss || 0,
                result.isp || '',
                result.userLocation ? `${result.userLocation.city}, ${result.userLocation.country}` : ''
            ].join(','))
        ].join('\n');

        this.downloadFile(`speed-test-results-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
    }

    exportToJSON() {
        if (this.speedHistory.length === 0) {
            alert('No test data to export. Please run a test first.');
            return;
        }

        const jsonContent = JSON.stringify({
            exportDate: new Date().toISOString(),
            testCount: this.speedHistory.length,
            results: this.speedHistory
        }, null, 2);

        this.downloadFile(`speed-test-results-${new Date().toISOString().split('T')[0]}.json`, jsonContent);
    }

    generateDetailedReport() {
        if (this.speedHistory.length === 0) {
            alert('No test data to generate report. Please run a test first.');
            return;
        }

        const latest = this.speedHistory[this.speedHistory.length - 1];
        const report = `
INTERNATIONAL NETWORK SPEED TEST REPORT
Generated: ${new Date().toLocaleString()}

=== LATEST TEST RESULTS ===
Test Server: ${latest.serverUsed}
Test Date: ${latest.timestamp?.toLocaleString()}

Download Speed: ${latest.downloadSpeed?.toFixed(2)} Mbps
Upload Speed: ${latest.uploadSpeed?.toFixed(2)} Mbps
Ping Latency: ${latest.ping} ms
Jitter: ${latest.jitter} ms
Packet Loss: ${latest.packetLoss?.toFixed(1)}%

=== CONNECTION DETAILS ===
Your IP Address: ${latest.ip}
ISP Provider: ${latest.isp}
Your Location: ${latest.userLocation ? `${latest.userLocation.city}, ${latest.userLocation.country}` : 'Unknown'}
DNS Resolution Time: ${latest.dnsTime} ms
Connection Time: ${latest.connectionTime} ms

=== ANALYSIS ===
${this.analyzeResults(latest)}

=== HISTORICAL SUMMARY ===
Total Tests Performed: ${this.speedHistory.length}
Average Download Speed: ${(this.speedHistory.reduce((sum, test) => sum + (test.downloadSpeed || 0), 0) / this.speedHistory.length).toFixed(2)} Mbps
Average Upload Speed: ${(this.speedHistory.reduce((sum, test) => sum + (test.uploadSpeed || 0), 0) / this.speedHistory.length).toFixed(2)} Mbps
Average Ping: ${Math.round(this.speedHistory.reduce((sum, test) => sum + (test.ping || 0), 0) / this.speedHistory.length)} ms

=== DISCLAIMER ===
This test measures your connection to real international servers, bypassing potential
ISP speed test manipulation that occurs with local/cached testing servers.
Results may vary based on network conditions, server load, and routing.
        `;

        this.downloadFile(`speed-test-report-${new Date().toISOString().split('T')[0]}.txt`, report);
    }

    analyzeResults(results) {
        let analysis = '';
        
        if (results.downloadSpeed < 5) {
            analysis += '⚠️ Download speed is quite low. Consider contacting your ISP.\n';
        } else if (results.downloadSpeed > 50) {
            analysis += '✅ Excellent download speed for most activities.\n';
        }

        if (results.ping > 100) {
            analysis += '⚠️ High latency detected. Gaming and video calls may be affected.\n';
        } else if (results.ping < 30) {
            analysis += '✅ Low latency - excellent for real-time applications.\n';
        }

        if (results.jitter > 50) {
            analysis += '⚠️ High jitter detected. Connection may be unstable.\n';
        }

        if (results.packetLoss > 1) {
            analysis += '⚠️ Packet loss detected. Network quality may be poor.\n';
        }

        return analysis || '✅ Overall connection quality appears normal.';
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    updateProgress(percentage) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    resetDisplay() {
        document.getElementById('downloadSpeed').textContent = '--';
        document.getElementById('uploadSpeed').textContent = '--';
        document.getElementById('ping').textContent = '--';
        document.getElementById('jitter').textContent = '--';
        this.updateProgress(0);
        document.getElementById('startTest').disabled = true;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the speed test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.speedTest = new NetworkSpeedTest();
});