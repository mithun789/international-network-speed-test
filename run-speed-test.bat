@echo off
title International Network Speed Test Suite
echo.
echo =========================================
echo  🌍 INTERNATIONAL NETWORK SPEED TEST SUITE
echo =========================================
echo.
echo This suite provides comprehensive network testing
echo against real international servers to bypass
echo ISP speed test manipulation.
echo.
echo OPTIONS:
echo [1] Open Web-Based Speed Test (Recommended)
echo [2] Run PowerShell Network Diagnostics
echo [3] Run Both Tests
echo [4] View Previous Results
echo [5] Help & Information
echo [Q] Quit
echo.

:menu
set /p choice="Enter your choice: "

if /i "%choice%"=="1" goto webbrowser
if /i "%choice%"=="2" goto powershell
if /i "%choice%"=="3" goto both
if /i "%choice%"=="4" goto results
if /i "%choice%"=="5" goto help
if /i "%choice%"=="q" goto quit

echo Invalid choice. Please try again.
goto menu

:webbrowser
echo.
echo 🌐 Opening web-based speed test...
start "" "speed-test.html"
echo.
echo The web-based test provides:
echo - Real-time speed visualization
echo - Multiple international server testing
echo - Advanced network metrics
echo - Detailed ISP analysis
echo - Export capabilities (CSV/JSON)
echo.
pause
goto menu

:powershell
echo.
echo 💻 Running PowerShell network diagnostics...
echo This may take 2-3 minutes to complete...
echo.
powershell.exe -ExecutionPolicy Bypass -File "network-diagnostics.ps1" -ExportCSV
echo.
echo Diagnostics completed!
pause
goto menu

:both
echo.
echo 🚀 Running comprehensive network analysis...
echo.
echo Step 1: Opening web-based speed test...
start "" "speed-test.html"
timeout /t 3 /nobreak >nul
echo.
echo Step 2: Running PowerShell diagnostics...
powershell.exe -ExecutionPolicy Bypass -File "network-diagnostics.ps1" -ExportCSV
echo.
echo Both tests completed!
pause
goto menu

:results
echo.
echo 📊 VIEWING PREVIOUS RESULTS
echo ========================
echo.
if exist "network-diagnostics-*.txt" (
    echo Available diagnostic reports:
    dir /b "network-diagnostics-*.txt"
    echo.
    set /p filename="Enter filename to view (or press Enter to skip): "
    if not "%filename%"=="" (
        if exist "%filename%" (
            type "%filename%"
            echo.
        ) else (
            echo File not found.
        )
    )
) else (
    echo No previous diagnostic reports found.
)

if exist "speed-test-results-*.csv" (
    echo.
    echo Available speed test CSV exports:
    dir /b "speed-test-results-*.csv"
    echo.
    echo Note: CSV files can be opened with Excel or any spreadsheet application.
) else (
    echo No previous speed test exports found.
)
echo.
pause
goto menu

:help
echo.
echo 📖 HELP & INFORMATION
echo ====================
echo.
echo ABOUT THIS TOOL:
echo This suite tests your internet connection against real international
echo servers to provide accurate speed measurements, bypassing potential
echo ISP manipulation of local speed test servers.
echo.
echo WEB-BASED TEST (speed-test.html):
echo - Tests download/upload speeds against international servers
echo - Measures ping, jitter, and packet loss
echo - Detects your ISP and location
echo - Provides detailed network analysis
echo - Exports results to CSV/JSON
echo - Works in any modern web browser
echo.
echo POWERSHELL DIAGNOSTICS (network-diagnostics.ps1):
echo - Comprehensive network interface analysis
echo - DNS resolution testing
echo - International ping tests to multiple servers
echo - Traceroute analysis
echo - System network configuration
echo - Exports detailed reports and CSV data
echo.
echo INTERNATIONAL TEST SERVERS INCLUDE:
echo - US East Coast (Virginia)
echo - US West Coast (California)  
echo - Europe West (London)
echo - Europe Central (Frankfurt)
echo - Asia East (Tokyo)
echo - Asia Southeast (Singapore)
echo - Australia (Sydney)
echo - Canada (Toronto)
echo - Brazil (São Paulo)
echo.
echo WHY DIFFERENT FROM OOKLA?
echo - Tests real international connectivity
echo - Bypasses ISP-controlled local servers
echo - Provides true end-to-end speed measurements
echo - Includes advanced network diagnostics
echo - No potential manipulation or caching
echo.
echo SYSTEM REQUIREMENTS:
echo - Windows 10/11
echo - PowerShell 5.1 or later
echo - Modern web browser (Chrome, Firefox, Edge)
echo - Internet connection
echo.
echo TROUBLESHOOTING:
echo - If PowerShell script fails, try running as Administrator
echo - If web test doesn't load, check firewall settings
echo - For slow results, try different server regions
echo - Close other network-intensive applications during testing
echo.
pause
goto menu

:quit
echo.
echo Thank you for using the International Network Speed Test Suite!
echo Results are saved in this directory for future reference.
echo.
pause
exit
