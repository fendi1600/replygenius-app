# Opens all signup/login pages in sequence with instructions
# Run once to set up all services

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     ReplyGenius — Service Setup (5 min total)    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opening all setup pages now..." -ForegroundColor Yellow
Write-Host ""

# 1. Expo / EAS
Write-Host "1️⃣  EXPO (for building the app)" -ForegroundColor White
Write-Host "   → Sign up free at expo.dev → then run: eas login" -ForegroundColor DarkGray
Start-Process "https://expo.dev/signup"
Start-Sleep -Milliseconds 800

# 2. Supabase
Write-Host "2️⃣  SUPABASE (database)" -ForegroundColor White
Write-Host "   → Sign up free, create project 'replygenius', copy URL + anon key" -ForegroundColor DarkGray
Start-Process "https://supabase.com/dashboard"
Start-Sleep -Milliseconds 800

# 3. Anthropic Claude
Write-Host "3️⃣  ANTHROPIC (AI replies)" -ForegroundColor White
Write-Host "   → Sign up, go to API Keys, click Create Key" -ForegroundColor DarkGray
Start-Process "https://console.anthropic.com/settings/keys"
Start-Sleep -Milliseconds 800

# 4. Meta
Write-Host "4️⃣  META (Facebook + Instagram)" -ForegroundColor White
Write-Host "   → Create App > Business type > copy App ID + Secret" -ForegroundColor DarkGray
Start-Process "https://developers.facebook.com/apps/create/"
Start-Sleep -Milliseconds 800

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "When you have the keys, open this file in Notepad and paste them:" -ForegroundColor Yellow
Write-Host "  $(Resolve-Path '.\.env')" -ForegroundColor White
Write-Host ""
Write-Host "Then run: npm run setup" -ForegroundColor Green
Write-Host "  → It will test all connections and deploy the schema automatically." -ForegroundColor DarkGray
Write-Host ""

# Open .env in Notepad
Start-Process notepad (Resolve-Path '.\.env')
