#!/bin/bash

echo "🤖 EgeBot Setup Script"
echo "====================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js sürümü: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm bulunamadı."
    exit 1
fi

echo "✅ npm sürümü: $(npm --version)"

# Install dependencies
echo "📦 Bağımlılıklar yükleniyor..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Environment dosyası oluşturuluyor..."
    cp .env.example .env.local
    echo "🔧 Lütfen .env.local dosyasında HF_API_TOKEN'ınızı güncelleyin!"
    echo "📋 Token almak için: https://huggingface.co/settings/tokens"
else
    echo "✅ .env.local dosyası mevcut"
fi

echo ""
echo "🎉 Kurulum tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo "1. .env.local dosyasında HF_API_TOKEN'ınızı ekleyin"
echo "2. 'npm run dev' komutuyla uygulamayı başlatın"
echo "3. http://localhost:3000 adresini açın"
echo ""
echo "🤖 EgeBot ile keyifli sohbetler!"