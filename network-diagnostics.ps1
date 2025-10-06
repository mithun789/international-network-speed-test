# International Network Diagnostic Tool
# Advanced PowerShell script for comprehensive network analysis

param(
    [string]$TestDuration = "30",
    [string]$OutputPath = ".\network-diagnostics-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').txt",
    [switch]$Detailed,
    [switch]$ExportCSV
)

Write-Host "🌍 International Network Diagnostic Tool" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# International test servers
$TestServers = @(
    @{Name="Google DNS (US)"; Host="8.8.8.8"; Location="United States"},
    @{Name="Cloudflare (Global)"; Host="1.1.1.1"; Location="Global CDN"},
    @{Name="OpenDNS (US)"; Host="208.67.222.222"; Location="United States"},
    @{Name="Quad9 (Global)"; Host="9.9.9.9"; Location="Global"},
    @{Name="Level3 (US)"; Host="4.2.2.2"; Location="United States"},
    @{Name="Google (London)"; Host="google.co.uk"; Location="United Kingdom"},
    @{Name="Amazon (Frankfurt)"; Host="amazon.de"; Location="Germany"},
    @{Name="Microsoft (Global)"; Host="microsoft.com"; Location="Global"},
    @{Name="GitHub (Global)"; Host="github.com"; Location="Global"},
    @{Name="Stack Overflow"; Host="stackoverflow.com"; Location="Global"}
)

# Create results array
$DiagnosticResults = @()
$PingResults = @()
$TraceResults = @()

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "=== $Title ===" -ForegroundColor Green
    Write-Host ""
}

function Test-NetworkInterface {
    Write-Section "Network Interface Information"
    
    $NetworkAdapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}
    foreach ($adapter in $NetworkAdapters) {
        Write-Host "Interface: $($adapter.Name)" -ForegroundColor Yellow
        Write-Host "  Description: $($adapter.InterfaceDescription)"
        Write-Host "  Link Speed: $($adapter.LinkSpeed)"
        Write-Host "  MAC Address: $($adapter.MacAddress)"
        
        $ipConfig = Get-NetIPConfiguration -InterfaceAlias $adapter.Name -ErrorAction SilentlyContinue
        if ($ipConfig) {
            Write-Host "  IP Address: $($ipConfig.IPv4Address.IPAddress)"
            Write-Host "  Subnet Mask: $($ipConfig.IPv4Address.PrefixLength)"
            Write-Host "  Gateway: $($ipConfig.IPv4DefaultGateway.NextHop)"
            Write-Host "  DNS Servers: $($ipConfig.DNSServer.ServerAddresses -join ', ')"
        }
        Write-Host ""
    }
}

function Test-DNSResolution {
    Write-Section "DNS Resolution Test"
    
    $DNSServers = @("8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9")
    $TestDomains = @("google.com", "microsoft.com", "github.com", "stackoverflow.com", "amazon.com")
    
    foreach ($dns in $DNSServers) {
        Write-Host "Testing DNS Server: $dns" -ForegroundColor Yellow
        
        foreach ($domain in $TestDomains) {
            try {
                $startTime = Get-Date
                $result = Resolve-DnsName -Name $domain -Server $dns -ErrorAction Stop
                $endTime = Get-Date
                $resolveTime = ($endTime - $startTime).TotalMilliseconds
                
                Write-Host "  $domain : $($result[0].IPAddress) ($([math]::Round($resolveTime, 2)) ms)" -ForegroundColor Green
            }
            catch {
                Write-Host "  $domain : FAILED" -ForegroundColor Red
            }
        }
        Write-Host ""
    }
}

function Test-InternationalPing {
    Write-Section "International Ping Test"
    
    foreach ($server in $TestServers) {
        Write-Host "Testing: $($server.Name) ($($server.Location))" -ForegroundColor Yellow
        
        try {
            $pingResult = Test-Connection -ComputerName $server.Host -Count 4 -ErrorAction Stop
            $avgPing = ($pingResult | Measure-Object -Property ResponseTime -Average).Average
            $minPing = ($pingResult | Measure-Object -Property ResponseTime -Minimum).Minimum
            $maxPing = ($pingResult | Measure-Object -Property ResponseTime -Maximum).Maximum
            $packetLoss = (4 - $pingResult.Count) / 4 * 100
            
            Write-Host "  Average: $([math]::Round($avgPing, 2)) ms" -ForegroundColor Green
            Write-Host "  Min/Max: $minPing ms / $maxPing ms"
            Write-Host "  Packet Loss: $packetLoss%"
            
            $PingResults += [PSCustomObject]@{
                Server = $server.Name
                Location = $server.Location
                Host = $server.Host
                AveragePing = [math]::Round($avgPing, 2)
                MinPing = $minPing
                MaxPing = $maxPing
                PacketLoss = $packetLoss
                Timestamp = (Get-Date).ToString()
            }
        }
        catch {
            Write-Host "  FAILED TO REACH SERVER" -ForegroundColor Red
            $PingResults += [PSCustomObject]@{
                Server = $server.Name
                Location = $server.Location
                Host = $server.Host
                AveragePing = "TIMEOUT"
                MinPing = "TIMEOUT"
                MaxPing = "TIMEOUT"
                PacketLoss = 100
                Timestamp = (Get-Date).ToString()
            }
        }
        Write-Host ""
    }
}

function Test-Traceroute {
    Write-Section "Traceroute Analysis"
    
    $KeyServers = @(
        @{Name="Google (US)"; Host="8.8.8.8"},
        @{Name="Cloudflare"; Host="1.1.1.1"},
        @{Name="GitHub"; Host="github.com"}
    )
    
    foreach ($server in $KeyServers) {
        Write-Host "Traceroute to: $($server.Name)" -ForegroundColor Yellow
        Write-Host "Target: $($server.Host)" -ForegroundColor Gray
        
        try {
            $traceResult = Test-NetConnection -ComputerName $server.Host -TraceRoute -ErrorAction Stop
            
            Write-Host "  Hops to destination: $($traceResult.TraceRoute.Count)"
            Write-Host "  Final destination: $($traceResult.RemoteAddress)"
            Write-Host "  Connection successful: $($traceResult.TcpTestSucceeded)"
            
            if ($Detailed) {
                Write-Host "  Route path:"
                for ($i = 0; $i -lt $traceResult.TraceRoute.Count; $i++) {
                    Write-Host "    Hop $($i+1): $($traceResult.TraceRoute[$i])"
                }
            }
            
            $TraceResults += [PSCustomObject]@{
                Server = $server.Name
                Host = $server.Host
                HopCount = $traceResult.TraceRoute.Count
                FinalDestination = $traceResult.RemoteAddress
                ConnectionSuccess = $traceResult.TcpTestSucceeded
                Route = ($traceResult.TraceRoute -join " -> ")
                Timestamp = (Get-Date).ToString()
            }
        }
        catch {
            Write-Host "  TRACEROUTE FAILED" -ForegroundColor Red
        }
        Write-Host ""
    }
}

function Test-Bandwidth {
    Write-Section "Bandwidth Estimation Test"
    
    Write-Host "Performing bandwidth test using PowerShell method..." -ForegroundColor Yellow
    
    # Test download speed using multiple HTTP requests
    $TestURLs = @(
        "https://httpbin.org/bytes/1048576",  # 1MB
        "https://jsonplaceholder.typicode.com/photos",
        "https://api.github.com/repos/microsoft/powershell/releases"
    )
    
    $TotalBytes = 0
    $TotalTime = 0
    
    foreach ($url in $TestURLs) {
        try {
            Write-Host "  Testing with: $url"
            $startTime = Get-Date
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
            $endTime = Get-Date
            
            $bytes = $response.Content.Length
            $timeMs = ($endTime - $startTime).TotalMilliseconds
            
            $TotalBytes += $bytes
            $TotalTime += $timeMs
            
            $speedKbps = ($bytes * 8) / ($timeMs / 1000) / 1024
            Write-Host "    Size: $bytes bytes, Time: $([math]::Round($timeMs, 2)) ms, Speed: $([math]::Round($speedKbps, 2)) Kbps"
        }
        catch {
            Write-Host "    FAILED: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    if ($TotalTime -gt 0) {
        $EstimatedSpeedMbps = ($TotalBytes * 8) / ($TotalTime / 1000) / 1024 / 1024
        Write-Host ""
        Write-Host "Estimated Download Speed: $([math]::Round($EstimatedSpeedMbps, 2)) Mbps" -ForegroundColor Green
    }
}

function Get-PublicIPInfo {
    Write-Section "Public IP and ISP Information"
    
    try {
        Write-Host "Detecting public IP and ISP information..." -ForegroundColor Yellow
        
        # Try multiple IP detection services
        $IPServices = @(
            "https://ipinfo.io/json",
            "https://httpbin.org/ip"
        )
        
        foreach ($service in $IPServices) {
            try {
                $response = Invoke-RestMethod -Uri $service -TimeoutSec 10
                
                if ($service -like "*ipinfo.io*") {
                    Write-Host "Public IP: $($response.ip)" -ForegroundColor Green
                    Write-Host "ISP/Organization: $($response.org)"
                    Write-Host "Location: $($response.city), $($response.region), $($response.country)"
                    Write-Host "Timezone: $($response.timezone)"
                    if ($response.loc) {
                        Write-Host "Coordinates: $($response.loc)"
                    }
                    break
                } elseif ($service -like "*httpbin.org*") {
                    Write-Host "Public IP: $($response.origin)" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "Failed to get info from $service" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "Failed to detect public IP information" -ForegroundColor Red
    }
    Write-Host ""
}

function Get-SystemNetworkInfo {
    Write-Section "System Network Configuration"
    
    # Get routing table
    Write-Host "Default Route Information:" -ForegroundColor Yellow
    $routes = Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue
    foreach ($route in $routes) {
        Write-Host "  Interface: $($route.InterfaceAlias)"
        Write-Host "  Gateway: $($route.NextHop)"
        Write-Host "  Metric: $($route.RouteMetric)"
        Write-Host ""
    }
    
    # Get network statistics
    Write-Host "Network Statistics:" -ForegroundColor Yellow
    $netStats = Get-NetAdapterStatistics
    foreach ($stat in $netStats) {
        if ($stat.BytesReceived -gt 0 -or $stat.BytesSent -gt 0) {
            Write-Host "  $($stat.Name):"
            Write-Host "    Bytes Received: $([math]::Round($stat.BytesReceived / 1MB, 2)) MB"
            Write-Host "    Bytes Sent: $([math]::Round($stat.BytesSent / 1MB, 2)) MB"
            Write-Host "    Packets Received: $($stat.PacketsReceived)"
            Write-Host "    Packets Sent: $($stat.PacketsSent)"
        }
    }
}

function Export-Results {
    Write-Section "Exporting Results"
    
    # Ensure output directory exists
    $outputDir = Split-Path $OutputPath -Parent
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    # Create comprehensive report
    $report = @"
INTERNATIONAL NETWORK DIAGNOSTIC REPORT
Generated: $(Get-Date)
========================================

SYSTEM INFORMATION:
Computer: $env:COMPUTERNAME
User: $env:USERNAME
PowerShell Version: $($PSVersionTable.PSVersion)

PING TEST SUMMARY:
$($PingResults | Format-Table -AutoSize | Out-String)

TRACEROUTE SUMMARY:
$($TraceResults | Format-Table -AutoSize | Out-String)
"@

    # Save detailed report
    try {
        $report | Out-File -FilePath $OutputPath -Encoding UTF8 -Force
        Write-Host "Detailed report saved to: $OutputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to save report: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Export CSV if requested
    if ($ExportCSV -and $PingResults.Count -gt 0) {
        try {
            $csvPath = $OutputPath.Replace('.txt', '-ping-results.csv')
            $PingResults | Export-Csv -Path $csvPath -NoTypeInformation -Force
            Write-Host "Ping results CSV saved to: $csvPath" -ForegroundColor Green
        }
        catch {
            Write-Host "Failed to save ping CSV: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        try {
            $traceCsvPath = $OutputPath.Replace('.txt', '-trace-results.csv')
            if ($TraceResults.Count -gt 0) {
                $TraceResults | Export-Csv -Path $traceCsvPath -NoTypeInformation -Force
                Write-Host "Traceroute results CSV saved to: $traceCsvPath" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "Failed to save traceroute CSV: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Main execution
$startTime = Get-Date

Write-Host "Starting comprehensive network diagnostics..." -ForegroundColor Cyan
Write-Host "Estimated completion time: 2-3 minutes" -ForegroundColor Gray
Write-Host ""

# Run all diagnostic tests
Get-PublicIPInfo
Test-NetworkInterface
Test-DNSResolution
Test-InternationalPing
Test-Traceroute
Test-Bandwidth
Get-SystemNetworkInfo

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Section "Diagnostic Summary"
Write-Host "Total diagnostic time: $([math]::Round($duration.TotalMinutes, 2)) minutes" -ForegroundColor Cyan

# Show quick summary
Write-Host ""
Write-Host "QUICK SUMMARY:" -ForegroundColor Yellow
$bestPing = $PingResults | Where-Object {$_.AveragePing -ne "TIMEOUT"} | Sort-Object AveragePing | Select-Object -First 1
if ($bestPing) {
    Write-Host "  Best Server: $($bestPing.Server) - $($bestPing.AveragePing) ms" -ForegroundColor Green
}

$worstPing = $PingResults | Where-Object {$_.AveragePing -ne "TIMEOUT"} | Sort-Object AveragePing -Descending | Select-Object -First 1
if ($worstPing) {
    Write-Host "  Slowest Server: $($worstPing.Server) - $($worstPing.AveragePing) ms" -ForegroundColor Red
}

$failedServers = ($PingResults | Where-Object {$_.AveragePing -eq "TIMEOUT"}).Count
Write-Host "  Failed Connections: $failedServers out of $($PingResults.Count)" -ForegroundColor $(if($failedServers -gt 0){"Red"}else{"Green"})

Export-Results

Write-Host ""
Write-Host "🎯 Network diagnostic completed successfully!" -ForegroundColor Green
Write-Host "📄 Open the HTML speed test for browser-based testing: speed-test.html" -ForegroundColor Cyan
Write-Host ""