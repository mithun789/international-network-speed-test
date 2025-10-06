# International Network Speed Test Suite

A comprehensive network testing toolkit that measures your true internet speed against international servers, bypassing potential ISP speed test manipulation.

## 🌍 Features

### Web-Based Speed Test (`speed-test.html`)
- **Real International Testing**: Tests against servers in 9+ international locations
- **Advanced Metrics**: Download/Upload speeds, Ping, Jitter, Packet Loss
- **ISP Detection**: Identifies your ISP and geographic location
- **Real-time Visualization**: Live speed graphs and progress tracking
- **Multi-Server Testing**: Compare performance across all international servers
- **Export Capabilities**: Save results to CSV/JSON for analysis
- **Detailed Diagnostics**: DNS resolution times, connection analysis

### PowerShell Diagnostics (`network-diagnostics.ps1`)
- **Network Interface Analysis**: Detailed adapter information
- **DNS Resolution Testing**: Test multiple DNS servers and domains
- **International Ping Tests**: Latency testing to global servers
- **Traceroute Analysis**: Network path visualization
- **System Network Configuration**: Routing tables and statistics
- **Comprehensive Reporting**: Detailed text and CSV exports

### Easy Launcher (`run-speed-test.bat`)
- **User-Friendly Menu**: Simple command-line interface
- **Integrated Testing**: Run web and PowerShell tests together
- **Results Management**: View and manage previous test results
- **Help System**: Comprehensive documentation and troubleshooting

## 🚀 Quick Start

1. **Double-click** `run-speed-test.bat` to launch the menu
2. **Choose Option 1** for the web-based speed test (recommended)
3. **Choose Option 2** for PowerShell diagnostics
4. **Choose Option 3** to run both tests

## 🌐 International Test Servers

- **US East** (Virginia) - Amazon/Google infrastructure
- **US West** (California) - Major tech hubs
- **Europe West** (London) - UK connectivity
- **Europe Central** (Frankfurt) - German data centers
- **Asia East** (Tokyo) - Japanese servers
- **Asia Southeast** (Singapore) - Regional hub
- **Australia** (Sydney) - Oceania connectivity
- **Canada** (Toronto) - North American alternative
- **Brazil** (São Paulo) - South American testing

## 📊 Why This Tool?

### Problems with Traditional Speed Tests
- **ISP Manipulation**: Many ISPs prioritize traffic to popular speed test sites
- **Local Servers**: Tests often use ISP-controlled local servers
- **Cached Results**: Some tests use pre-cached data
- **Limited Scope**: Don't test true international connectivity

### Our Solution
- **Real International Servers**: Tests actual global connectivity
- **No ISP Control**: Uses independent international infrastructure
- **Comprehensive Analysis**: Beyond just download/upload speeds
- **Transparent Results**: Full diagnostic information provided
- **Historical Tracking**: Save and compare results over time

## 📋 Detailed Usage

### Web-Based Test
1. Open `speed-test.html` in any modern browser
2. Select your preferred test server region or use auto-select
3. Choose test type (Full/Download Only/Upload Only/Ping Only)
4. Click "Start Speed Test" or "Test All Servers"
5. View real-time results and detailed diagnostics
6. Export results using the export buttons

### PowerShell Diagnostics
```powershell
# Basic usage
.\network-diagnostics.ps1

# With CSV export
.\network-diagnostics.ps1 -ExportCSV

# Detailed traceroute analysis
.\network-diagnostics.ps1 -Detailed

# Custom output location
.\network-diagnostics.ps1 -OutputPath "C:\MyResults\network-test.txt"
```

### Command Line Parameters
- `-TestDuration`: Test duration in seconds (default: 30)
- `-OutputPath`: Custom output file path
- `-Detailed`: Include detailed traceroute hops
- `-ExportCSV`: Export results to CSV format

## 📈 Understanding Results

### Speed Measurements
- **Download Speed**: Data reception rate from international servers
- **Upload Speed**: Data transmission rate to international servers
- **Ping**: Round-trip time to server (latency)
- **Jitter**: Variation in ping times (connection stability)
- **Packet Loss**: Percentage of lost network packets

### Network Quality Indicators
- **Ping < 30ms**: Excellent for gaming and video calls
- **Ping 30-100ms**: Good for most applications
- **Ping > 100ms**: May affect real-time applications
- **Jitter < 20ms**: Stable connection
- **Jitter > 50ms**: Unstable connection
- **Packet Loss 0%**: Perfect connection
- **Packet Loss > 1%**: Network quality issues

## 🔧 Troubleshooting

### PowerShell Execution Policy
If PowerShell scripts won't run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Web Test Issues
- Ensure JavaScript is enabled in your browser
- Check firewall settings for HTTP/HTTPS access
- Try a different browser if issues persist
- Disable VPN/proxy for accurate results

### Performance Issues
- Close bandwidth-intensive applications
- Test during off-peak hours
- Try different server regions
- Check for background Windows updates

## 📄 File Descriptions

- **`speed-test.html`**: Main web interface with interactive speed testing
- **`speed-test.js`**: JavaScript engine for web-based testing
- **`network-diagnostics.ps1`**: PowerShell script for system-level diagnostics
- **`run-speed-test.bat`**: Windows batch file launcher with menu system
- **`README.md`**: This documentation file

## 🎯 Use Cases

### Home Users
- Verify ISP advertised speeds
- Troubleshoot slow internet issues
- Compare different times of day
- Test international connectivity for streaming/gaming

### IT Professionals
- Network performance auditing
- ISP service validation
- International connectivity assessment
- Historical performance tracking

### Businesses
- Remote work connectivity testing
- International office connectivity
- VPN performance evaluation
- Service level agreement validation

## 📊 Export Formats

### CSV Export Fields
- Timestamp
- Test Server Location
- Download Speed (Mbps)
- Upload Speed (Mbps)
- Ping Latency (ms)
- Jitter (ms)
- Packet Loss (%)
- ISP Information
- User Location

### JSON Export Structure
```json
{
  "exportDate": "2024-XX-XX",
  "testCount": 5,
  "results": [
    {
      "timestamp": "2024-XX-XX",
      "serverUsed": "US East (Virginia)",
      "downloadSpeed": 85.34,
      "uploadSpeed": 23.45,
      "ping": 45,
      "jitter": 12,
      "packetLoss": 0,
      "isp": "Your ISP Name",
      "userLocation": {
        "city": "Your City",
        "country": "Your Country"
      }
    }
  ]
}
```

## 🛡️ Privacy & Security

- **No Data Collection**: All tests run locally on your machine
- **No Account Required**: No registration or personal information needed
- **Local Storage Only**: Results saved only on your computer
- **Open Source**: All code is visible and auditable
- **No Tracking**: No analytics or user behavior tracking

## 🔄 Version History

### v1.0 (Current)
- Initial release with web and PowerShell testing
- International server support
- CSV/JSON export capabilities
- Comprehensive diagnostic reporting
- User-friendly launcher interface

---

## Release Notes

Version 1.0.0 (2025-10-06)

- Initial public release. Includes:
  - Web-based international speed test (`speed-test.html`, `speed-test.js`)
  - PowerShell diagnostics with CSV/trace exports (`network-diagnostics.ps1`)
  - Robust export handling and better error reporting
  - GitHub Actions workflow for PowerShell linting


## 📞 Support

This tool is designed to be self-contained and require no external support. All diagnostics and help information are included in the interface.

For technical issues:
1. Check the troubleshooting section above
2. Run the PowerShell script as Administrator
3. Try different browsers for the web test
4. Ensure all files are in the same directory

---

**Note**: This tool provides educational and diagnostic information about your network connection. Results may vary based on network conditions, server load, and routing. Always run multiple tests at different times for comprehensive analysis.