# PowerShell & Node Dual Web Server for DriveSense (PC & Mobile Wi-Fi)
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# Check for local node binary dynamically
$nodePath = Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $nodePath) {
    $candidates = @(
        "C:\Users\kudup\AppData\Local\ms-playwright-go\1.57.0\node.exe",
        "C:\Program Files\nodejs\node.exe",
        "$env:LOCALAPPDATA\Programs\node.exe"
    )
    foreach ($cand in $candidates) {
        if (Test-Path $cand) {
            $nodePath = $cand
            break
        }
    }
}

if ($nodePath -and (Test-Path $nodePath)) {
    & $nodePath "$root\server.js"
    exit 0
}

# Fallback PowerShell HttpListener
$port = 8080
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -ExpandProperty IPAddress -First 1)
if (-not $localIp) { $localIp = "127.0.0.1" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Prefixes.Add("http://127.0.0.1:${port}/")
try { $listener.Prefixes.Add("http://+:${port}/") } catch {}
$listener.Start()

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " DriveSense Web Server Active (PC & Mobile)" -ForegroundColor Green
Write-Host " PC Access: http://localhost:${port}/" -ForegroundColor Yellow
Write-Host " Mobile Access (Wi-Fi): http://${localIp}:${port}/" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Start-Process "http://localhost:${port}/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.AbsolutePath
        if ([string]::IsNullOrWhiteSpace($rawPath) -or $rawPath -eq "/") { $rawPath = "/index.html" }
        $relativePath = $rawPath.TrimStart('/')
        $filePath = Join-Path $root $relativePath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html"  { "text/html; charset=utf-8" }
                ".css"   { "text/css; charset=utf-8" }
                ".js"    { "application/javascript; charset=utf-8" }
                ".json"  { "application/json; charset=utf-8" }
                ".png"   { "image/png" }
                ".jpg"   { "image/jpeg" }
                ".svg"   { "image/svg+xml" }
                default  { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
            $response.Close()
        }
    }
} finally {
    if ($listener) { $listener.Stop() }
}
