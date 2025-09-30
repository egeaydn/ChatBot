@echo off
echo 🤖 EgeBot Setup Script
echo =====================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js sürümü:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm bulunamadı.
    pause
    exit /b 1
)

echo ✅ npm sürümü:
npm --version

REM Install dependencies
echo 📦 Bağımlılıklar yükleniyor...
npm install

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚙️  Environment dosyası oluşturuluyor...
    copy .env.example .env.local
    echo 🔧 Lütfen .env.local dosyasında HF_API_TOKEN'ınızı güncelleyin!
    echo 📋 Token almak için: https://huggingface.co/settings/tokens
) else (
    echo ✅ .env.local dosyası mevcut
)

echo.
echo 🎉 Kurulum tamamlandı!
echo.
echo Sonraki adımlar:
echo 1. .env.local dosyasında HF_API_TOKEN'ınızı ekleyin
echo 2. 'npm run dev' komutuyla uygulamayı başlatın
echo 3. http://localhost:3000 adresini açın
echo.
echo 🤖 EgeBot ile keyifli sohbetler!
echo.
pause