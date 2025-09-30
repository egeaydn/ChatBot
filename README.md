# 🤖 EgeBot - Professional AI Chatbot

Modern ve profesyonel bir AI chatbot uygulaması. Hugging Face API'sini kullanarak doğal, sohbet tarzı ve gerçekçi cevaplar veren bir yapay zeka asistanı.

## ✨ Özellikler

- 🎯 **Çoklu Kişilik Modu**: 5 farklı bot kişiliği (Varsayılan, Arkadaş Canlısı, Profesyonel, Yaratıcı, Esprili)
- 💬 **Gerçek Zamanlı Chat**: Anlık mesajlaşma deneyimi
- 🎨 **Modern UI/UX**: Tailwind CSS ile responsive tasarım
- 🌙 **Dark/Light Mode**: Otomatik tema desteği
- 📱 **Mobile-First**: Tüm cihazlarda mükemmel çalışır
- 🔄 **Loading States**: Gelişmiş yükleme animasyonları
- 💾 **Chat History**: Mesaj geçmişi yönetimi
- 🧹 **Chat Temizleme**: Sohbeti temizleme özelliği

## 🚀 Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **AI Model**: Hugging Face Inference API (DialoGPT-medium)
- **API**: Next.js API Routes

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repo-url>
cd chatbot
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables'ları ayarlayın:**
```bash
cp .env.example .env.local
```

4. **Hugging Face API Token'ınızı ekleyin:**
   - [Hugging Face](https://huggingface.co/settings/tokens) adresinden ücretsiz token alın
   - `.env.local` dosyasında `HF_API_TOKEN` değerini güncelleyin

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

6. **Tarayıcıda açın:**
   [http://localhost:3000](http://localhost:3000)

## 🔧 Konfigürasyon

### Environment Variables

```env
# Hugging Face API Token (GEREKLİ)
HF_API_TOKEN=your_token_here

# Uygulama Ayarları
NEXT_PUBLIC_APP_NAME=EgeBot
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Bot Kişilikleri

- **Varsayılan**: Standart AI asistan davranışı
- **Arkadaş Canlısı**: Sıcak, dostane ve pozitif
- **Profesyonel**: Resmi ve iş odaklı
- **Yaratıcı**: Sanatsal ve farklı bakış açıları
- **Esprili**: Komik ve mizahi yaklaşım

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── api/chat/          # API endpoint
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # App layout
│   └── page.tsx          # Ana sayfa
├── components/
│   ├── ChatContainer.tsx  # Ana chat container
│   ├── ChatInput.tsx     # Mesaj input komponenti
│   ├── ChatMessages.tsx  # Mesaj listesi
│   ├── MessageBubble.tsx # Tekil mesaj balonu
│   └── PersonalitySelector.tsx # Kişilik seçici
└── types/
    └── chat.ts           # TypeScript tip tanımları
```

## 🎨 UI Bileşenleri

### ChatContainer
Ana chat yönetim bileşeni. State yönetimi ve API çağrıları.

### MessageBubble
Tekil mesaj gösterimi. Kullanıcı/bot ayırımı ve timestamp.

### PersonalitySelector
Bot kişiliği seçme interface'i. 5 farklı kişilik modu.

### ChatInput
Mesaj girişi ve gönderimi. Klavye kısayolları ve loading states.

## 🔌 API Endpoints

### POST /api/chat
Kullanıcı mesajını işler ve bot cevabı döner.

**Request:**
```json
{
  "message": "Merhaba!",
  "personality": "friendly"
}
```

**Response:**
```json
{
  "message": "Merhaba! Nasılsın? Seni görmek çok güzel!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Deploy

### Vercel (Önerilen)
```bash
npx vercel --prod
```

### Netlify
```bash
npm run build
# Build output'u netlify'a yükleyin
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔮 Gelecek Özellikler

- [ ] **Sesli Mesaj**: Voice-to-text entegrasyonu
- [ ] **TTS (Text-to-Speech)**: Bot cevaplarını sesli okuma
- [ ] **Chat Export**: Sohbet geçmişini dışa aktarma
- [ ] **Tema Seçenekleri**: Özelleştirilebilir renkler
- [ ] **Plugin Sistemi**: Genişletilebilir özellikler
- [ ] **Multi-language**: Çoklu dil desteği
- [ ] **File Upload**: Dosya paylaşımı
- [ ] **Database Integration**: Kalıcı chat geçmişi

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push'layın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

EgeBot ile ilgili sorularınız için iletişime geçebilirsiniz.

---

**Not**: Ücretsiz Hugging Face API'si kullanıldığı için ilk istekte biraz gecikme olabilir (cold start). Production ortamında paid plan'e geçmeniz önerilir.
