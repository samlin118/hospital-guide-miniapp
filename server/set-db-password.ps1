# Securely write MySQL root password into .env
# Usage: run in server dir  .\set-db-password.ps1
# Password input is masked with * and never logged.

$ErrorActionPreference = 'Stop'
$envPath = Join-Path $PSScriptRoot '.env'

if (-not (Test-Path $envPath)) {
    Write-Host "ERROR: .env not found at $envPath" -ForegroundColor Red
    exit 1
}

$secure = Read-Host 'Enter local MySQL root password' -AsSecureString
if ($secure.Length -eq 0) {
    Write-Host 'Empty password, no change made.' -ForegroundColor Yellow
    exit 0
}

$plain = [System.Net.NetworkCredential]::new('', $secure).Password

$lines = Get-Content -Raw -Path $envPath
$newLines = $lines -replace '(?m)^DB_PASSWORD=.*$', "DB_PASSWORD=$plain"

Set-Content -Path $envPath -Value $newLines -Encoding UTF8
Write-Host 'Password written to .env (stored locally only).' -ForegroundColor Green
Write-Host 'Re-run .\set-db-password.ps1 to change it later.' -ForegroundColor Cyan
