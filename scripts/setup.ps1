# ReplyGenius — Full System Setup Script
# Run: powershell -ExecutionPolicy Bypass -File scripts\setup.ps1

Write-Host "`n⚡ ReplyGenius Setup" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════" -ForegroundColor DarkGray

$envFile = "$PSScriptRoot\..\env"
$envFile = Resolve-Path "$PSScriptRoot\..\env" -ErrorAction SilentlyContinue
if (-not $envFile) { $envFile = "$PSScriptRoot\..\.env" }

function Read-EnvFile {
    $vars = @{}
    if (Test-Path $envFile) {
        Get-Content $envFile | Where-Object { $_ -match "^[^#].*=.+" } | ForEach-Object {
            $parts = $_ -split "=", 2
            $vars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
    return $vars
}

function Test-Key($name, $value) {
    if (-not $value -or $value -eq "") {
        Write-Host "  ✗ $name — MISSING" -ForegroundColor Red
        return $false
    }
    Write-Host "  ✓ $name — found ($($value.Substring(0,[Math]::Min(12,$value.Length)))...)" -ForegroundColor Green
    return $true
}

# ── Step 1: Check .env ─────────────────────────────────
Write-Host "`n[1/4] Checking .env keys..." -ForegroundColor Yellow
$env = Read-EnvFile
$ok = $true
$ok = (Test-Key "EXPO_PUBLIC_SUPABASE_URL"    $env["EXPO_PUBLIC_SUPABASE_URL"])    -and $ok
$ok = (Test-Key "EXPO_PUBLIC_SUPABASE_ANON"   $env["EXPO_PUBLIC_SUPABASE_ANON"])   -and $ok
$ok = (Test-Key "EXPO_PUBLIC_CLAUDE_API_KEY"  $env["EXPO_PUBLIC_CLAUDE_API_KEY"])  -and $ok
$ok = (Test-Key "EXPO_PUBLIC_META_APP_ID"     $env["EXPO_PUBLIC_META_APP_ID"])     -and $ok

if (-not $ok) {
    Write-Host "`n  → Fill in the missing keys in .env, then re-run this script." -ForegroundColor Cyan
    Write-Host "  → Opening .env in Notepad..." -ForegroundColor DarkGray
    Start-Process notepad $envFile
    exit 1
}

# ── Step 2: Test Supabase ──────────────────────────────
Write-Host "`n[2/4] Testing Supabase connection..." -ForegroundColor Yellow
$url   = $env["EXPO_PUBLIC_SUPABASE_URL"]
$anon  = $env["EXPO_PUBLIC_SUPABASE_ANON"]
try {
    $resp = Invoke-RestMethod "$url/rest/v1/" -Headers @{ apikey = $anon; Authorization = "Bearer $anon" } -ErrorAction Stop
    Write-Host "  ✓ Supabase connected — $url" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Supabase failed: $_" -ForegroundColor Red
    $ok = $false
}

# ── Step 3: Deploy schema if tables missing ────────────
Write-Host "`n[3/4] Deploying database schema..." -ForegroundColor Yellow
$schemaFile = "$PSScriptRoot\..\supabase\schema.sql"
if (Test-Path $schemaFile) {
    Write-Host "  → Schema file found. Paste contents into:" -ForegroundColor Cyan
    Write-Host "    $url/dashboard/sql" -ForegroundColor White
    Write-Host "  → Opening Supabase SQL Editor..." -ForegroundColor DarkGray
    Start-Process "$url/dashboard/sql/new"
    # Copy schema to clipboard
    Get-Content $schemaFile | Set-Clipboard
    Write-Host "  ✓ Schema SQL copied to clipboard — just paste (Ctrl+V) and click Run" -ForegroundColor Green
} else {
    Write-Host "  ✗ Schema file not found at $schemaFile" -ForegroundColor Red
}

# ── Step 4: Test Claude API ────────────────────────────
Write-Host "`n[4/4] Testing Claude API..." -ForegroundColor Yellow
$claudeKey = $env["EXPO_PUBLIC_CLAUDE_API_KEY"]
try {
    $body = '{"model":"claude-haiku-4-5","max_tokens":10,"messages":[{"role":"user","content":"ping"}]}'
    $resp = Invoke-RestMethod "https://api.anthropic.com/v1/messages" `
        -Method POST `
        -Headers @{ "x-api-key" = $claudeKey; "anthropic-version" = "2023-06-01"; "content-type" = "application/json" } `
        -Body $body -ErrorAction Stop
    Write-Host "  ✓ Claude API working (model: $($resp.model))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Claude API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ── Summary ────────────────────────────────────────────
Write-Host "`n══════════════════════════════════════════" -ForegroundColor DarkGray
if ($ok) {
    Write-Host "✅ All systems ready! Start the app:" -ForegroundColor Green
    Write-Host "   npx expo start --lan" -ForegroundColor White
} else {
    Write-Host "⚠  Some checks failed — see above." -ForegroundColor Yellow
}
Write-Host ""
