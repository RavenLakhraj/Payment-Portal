# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "This script requires administrator privileges. Please run PowerShell as Administrator and try again."
    exit 1
}

# Function to convert PEM to CRT
function ConvertFrom-PEM {
    param (
        [string]$pemPath,
        [string]$outPath
    )
    
    $pemContent = Get-Content -Path $pemPath -Raw
    $base64 = $pemContent -replace '-----BEGIN CERTIFICATE-----', '' `
                         -replace '-----END CERTIFICATE-----', '' `
                         -replace '\s', ''
                         
    [System.IO.File]::WriteAllBytes($outPath, [Convert]::FromBase64String($base64))
}

# Prepare paths
$pemPath = Join-Path $PSScriptRoot "keys\certificate.pem"
$tempCrtPath = [System.IO.Path]::GetTempFileName() + ".crt"

if (-not (Test-Path $pemPath)) {
    Write-Error "Could not find CA certificate file at: $pemPath"
    exit 1
}

Write-Host "Converting PEM certificate to CRT format..."
try {
    ConvertFrom-PEM -pemPath $pemPath -outPath $tempCrtPath
} catch {
    Write-Error "Failed to convert PEM to CRT: $_"
    exit 1
}

Write-Host "Installing certificate from: $tempCrtPath"

try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($tempCrtPath)
    
    $storeName = [System.Security.Cryptography.X509Certificates.StoreName]::Root
    $storeLocation = [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine
    $store = New-Object System.Security.Cryptography.X509Certificates.X509Store($storeName, $storeLocation)
    
    $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
    $store.Add($cert)
    Write-Host "CA certificate installed successfully!"
} catch {
    Write-Error "Failed to install certificate: $_"
    exit 1
} finally {
    $store.Close()
    # Clean up temporary file
    if (Test-Path $tempCrtPath) {
        Remove-Item $tempCrtPath -Force
    }
}