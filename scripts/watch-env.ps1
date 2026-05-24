# Watch .env for changes — auto-tests connections when keys are added
# Run: powershell -ExecutionPolicy Bypass -File scripts\watch-env.ps1

$envPath = "$PSScriptRoot\..\.env"
Write-Host "👁  Watching .env for changes... (Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host "   Edit .env and save — connections will be tested automatically.`n" -ForegroundColor DarkGray

$lastHash = ""
while ($true) {
    if (Test-Path $envPath) {
        $hash = (Get-FileHash $envPath -Algorithm MD5).Hash
        if ($hash -ne $lastHash) {
            $lastHash = $hash
            if ($lastHash -ne "") {
                Write-Host "`n🔄 .env changed — running tests..." -ForegroundColor Yellow
                & "$PSScriptRoot\setup.ps1"
            }
        }
    }
    Start-Sleep -Seconds 2
}
