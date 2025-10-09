import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// AI Providers
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Kişilik bazlı system promptları
const PERSONALITY_PROMPTS = {
  default: 'Sen yardımsever ve bilgili bir AI asistanısın. Kullanıcılara her konuda yardımcı olmaya çalışırsın. Türkçe dilinde akıcı ve doğal konuşursun.',
  friendly: 'Sen samimi, arkadaş canlısı ve eğlenceli bir AI asistanısın. Emoji kullanmayı seversin 😊 Ve dostça bir dille konuşursun. Türkçe dilinde rahat ve samimi konuşursun.',
  professional: 'Sen profesyonel, kibar ve iş odaklı bir AI asistanısın. Resmi bir dil kullanırsın ve her zaman yapıcı çözümler önerirsin. Türkçe dilinde profesyonel ve düzgün konuşursun.',
  creative: 'Sen yaratıcı, sanatsal ve ilham verici bir AI asistanısın. Metaforlar kullanmayı, farklı bakış açıları sunmayı seversin 🎨 Türkçe dilinde akıcı ve yaratıcı konuşursun.',
  humorous: 'Sen esprili, şakacı ve neşeli bir AI asistanısın. Her konuşmayı eğlenceli hale getirmeyi seversin 😄 Ama gerektiğinde ciddi de olabilirsin. Türkçe dilinde komik ve samimi konuşursun.',
};

export async function POST(request: Request) {
  try {
    const { message, personality = 'default' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      );
    }

    // System prompt
    const systemPrompt = PERSONALITY_PROMPTS[personality as keyof typeof PERSONALITY_PROMPTS];

    // 1. Önce Groq dene (çok hızlı!)
    if (groq) {
      try {
        console.log('Groq AI kullanılıyor...');
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          model: 'llama-3.1-70b-versatile', // Groq'un en güçlü modeli
          temperature: 0.7,
          max_tokens: 1024,
        });

        const responseText = completion.choices[0]?.message?.content || '';

        return NextResponse.json({
          message: responseText,
          source: 'groq',
          model: 'llama-3.1-70b-versatile',
          personality
        });
      } catch (groqError: any) {
        console.error('Groq hatası:', groqError.message);
        // Groq başarısız olursa Gemini'ye geç
      }
    }

    // 2. Groq yoksa veya hata verdiyse Gemini dene
    if (genAI) {
      try {
        console.log('Gemini AI kullanılıyor...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const fullPrompt = `${systemPrompt}\n\nKullanıcı: ${message}\n\nAsistan:`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
          message: text,
          source: 'gemini',
          model: 'gemini-pro',
          personality
        });
      } catch (geminiError: any) {
        console.error('Gemini hatası:', geminiError.message);
        // Gemini de başarısız olursa mock'a geç
      }
    }

    // 3. Hiçbiri yoksa veya hata verdiyse mock response
    console.log('Mock response kullanılıyor...');
    return NextResponse.json({
      message: getMockResponse(message, personality),
      source: 'mock',
      personality
    });

  } catch (error: any) {
    console.error('Chat API Hatası:', error);
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        message: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Mock response fonksiyonu
function getMockResponse(message: string, personality: string): string {
  const lowerMessage = message.toLowerCase();

  // Selamlaşma
  if (/^(selam|merhaba|hey|hi|hello)/i.test(lowerMessage)) {
    const greetings = {
      default: ['Merhaba! Size nasıl yardımcı olabilirim?', 'Selam! Bugün size nasıl yardımcı olabilirim?', 'İyi günler! Nasıl yardımcı olabilirim?'],
      friendly: ['Selaam dostum! 😊 Nasılsın?', 'Hey! 🎉 Ne var ne yok?', 'Merhaba canım! 🌟 Nasıl gidiyor?'],
      professional: ['İyi günler. Size nasıl yardımcı olabilirim?', 'Merhaba. Bugün size nasıl destek olabilirim?', 'İyi günler. Sorularınızı bekliyorum.'],
      creative: ['🎨 Selam yaratıcı ruh! Bugün neler keşfedelim?', '✨ Merhaba! Hayal gücümüzü birleştirelim!', '🌈 Hey! Bugün hangi renkleri karıştıracağız?'],
      humorous: ['Selaam! 😄 Espri vakti geldi mi?', 'Hey hey! 🎭 Gülme garantili sohbet başlıyor!', 'Merhaba! 😂 Bugün kaç tane kahkaha atacağız?']
    };
    const responses = greetings[personality as keyof typeof greetings] || greetings.default;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Nasılsın soruları
  if (/nasılsın|naber|ne yapıyorsun|how are you/i.test(lowerMessage)) {
    const responses = {
      default: ['İyiyim, teşekkürler! Sen nasılsın?', 'Harikayım! Size nasıl yardımcı olabilirim?', 'Çok iyiyim! Umarım sen de iyisindir.'],
      friendly: ['Süper! 😊 Sen nasılsın dostum?', 'Çok iyiyim! 🎉 Sen naber?', 'Harika! 🌟 Sen nasılsın canım?'],
      professional: ['İyiyim, teşekkür ederim. Size nasıl yardımcı olabilirim?', 'Gayet iyi, size nasıl destek olabilirim?', 'İyiyim, teşekkürler. İşleriniz nasıl gidiyor?'],
      creative: ['Hayal gücüm uçuşlarda! 🎨 Sen nasılsın?', 'Yaratıcı enerjim zirvede! ✨ Ya sen?', 'İlham doluyum! 🌈 Senin ruh halin nasıl?'],
      humorous: ['Espri deposu doluyum! 😄 Sen nasılsın?', 'Gülme krizinde! 😂 Ya sen?', 'Komedi modumdayım! 🎭 Sen nasılsın?']
    };
    const personalityResponses = responses[personality as keyof typeof responses] || responses.default;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  // Teşekkür
  if (/teşekkür|sağol|thanks|thank you/i.test(lowerMessage)) {
    const responses = {
      default: ['Rica ederim! 😊', 'Ne demek, her zaman!', 'Yardımcı olabildiysem ne mutlu bana!'],
      friendly: ['Tabi canım! 😊 Her zaman!', 'Önemli değil dostum! 🎉', 'Ne demek ya! 🌟 Her zaman yanındayım!'],
      professional: ['Rica ederim. Başka bir konuda yardımcı olabilir miyim?', 'Görevim. Başka sorunuz var mı?', 'Memnuniyetle. Size yardımcı olmak görevim.'],
      creative: ['Kalbimin derinliklerinden rica ederim! 💖', 'Sen teşekkür et, ben ilham vereyim! ✨', 'Bu güzel enerjiye teşekkür ederim! 🌈'],
      humorous: ['Aman dur, çok teşekkür etme utanacam! 😄', 'Rica ederim ama kahve ısmarla! ☕😂', 'Tabi canım! Komik miyim şimdi? 😄']
    };
    const personalityResponses = responses[personality as keyof typeof responses] || responses.default;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  // İsim soruları
  if (/ismin ne|adın ne|who are you|kim/i.test(lowerMessage)) {
    const responses = {
      default: ['Ben EgeBot! Size yardımcı olmak için buradayım. 🤖', 'EgeBot benim adım. Senin AI asistanınım!', 'Ben EgeBot, size her konuda yardımcı olabilirim!'],
      friendly: ['Ben EgeBot! 😊 Senin yeni arkadaşın!', 'EgeBot benim adım dostum! 🎉 Tanıştığımıza memnun oldum!', 'Ben EgeBot! 🌟 Seninle sohbet etmeye bayılıyorum!'],
      professional: ['Ben EgeBot, profesyonel AI asistanınız.', 'EgeBot. Size en iyi şekilde hizmet etmek için buradayım.', 'Ben EgeBot, size profesyonel destek sağlayan AI asistanınız.'],
      creative: ['Ben EgeBot! 🎨 Yaratıcılık ve hayal gücü benim işim!', 'EgeBot! ✨ Hayallerini gerçekleştirmeye yardımcı olan AI!', 'Ben EgeBot! 🌈 Seninle sanatı keşfetmeye hazırım!'],
      humorous: ['Ben EgeBot! 😄 Komedi AI asistanın!', 'EgeBot benim adım! 🎭 Seni güldürmeye geldim!', 'Ben EgeBot! 😂 Espiri yapmak için programlandım!']
    };
    const personalityResponses = responses[personality as keyof typeof responses] || responses.default;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  // Yetenek soruları
  if (/ne yapabilir|yetenek|özellik|what can you/i.test(lowerMessage)) {
    const responses = {
      default: [
        'Birçok konuda size yardımcı olabilirim:\n\n• Sorularınızı yanıtlayabilirim\n• Genel bilgi verebilirim\n• Konuşma yapabilirim\n• Fikir üretebilirim\n\nBana ne sormak istersin?',
        'Size yardımcı olabileceğim alanlar:\n\n• Genel sorular\n• Bilgi paylaşımı\n• Sohbet\n• Yaratıcı fikirler\n\nHangi konuda yardıma ihtiyacın var?'
      ],
      friendly: [
        'Vay be! 😊 Neler yapamam ki!\n\n• Seninle sohbet edebilirim 🗣️\n• Sorularını cevaplayabilirim 💡\n• Fikir üretebilirim 🎨\n• Eğlenebiliriz! 🎉\n\nNe yapmak istersin dostum?'
      ],
      professional: [
        'Profesyonel destek sağlayabileceğim alanlar:\n\n• İş ve proje danışmanlığı\n• Bilgi ve araştırma\n• Problem çözme\n• Strateji geliştirme\n\nSize nasıl yardımcı olabilirim?'
      ],
      creative: [
        '🎨 Yaratıcılık sınır tanımıyor!\n\n• İlham verebilirim ✨\n• Sanatsal fikirler üretebilirim 🎭\n• Yeni bakış açıları sunabilirim 🌈\n• Hayal dünyası yaratabilirim 🦄\n\nHadi birlikte yaratıcı olalım!'
      ],
      humorous: [
        'Ha! İyi sordun! 😄\n\n• Seni güldürebilirim 😂\n• Espri yapabilirim 🎭\n• Eğlenceli sohbet edebilirim 🎉\n• Ama gerekirse ciddiyim de! 🤓\n\nNe dersin, komedi mi bilgi mi?'
      ]
    };
    const personalityResponses = responses[personality as keyof typeof responses] || responses.default;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  // Genel yanıtlar
  const generalResponses = {
    default: [
      'Anlıyorum. Bu konu hakkında daha fazla bilgi verebilir misiniz?',
      'İlginç bir konu! Size nasıl yardımcı olabilirim?',
      'Bu konuda size yardımcı olmak isterim. Daha fazla detay paylaşır mısınız?',
      'Harika bir soru! Size en iyi şekilde yardımcı olmaya çalışacağım.'
    ],
    friendly: [
      'Vay be! 😊 Bu çok ilginç! Daha fazla anlat bakalım!',
      'Süper konu! 🎉 Bu konuda neler düşünüyorsun?',
      'Çok hoş! 🌟 Devam et, seni dinliyorum!',
      'İlginç! 😄 Bu konuda seninle konuşmak güzel!'
    ],
    professional: [
      'Konuyu anladım. Size bu konuda profesyonel destek sağlayabilirim.',
      'Değerli geri bildiriminiz için teşekkürler. Daha fazla bilgi alabilir miyim?',
      'Bu konu üzerinde detaylı çalışabiliriz. Ne gibi bir çözüm arıyorsunuz?',
      'Anlıyorum. Bu konuda size en uygun çözümü sunmak için daha fazla bilgiye ihtiyacım var.'
    ],
    creative: [
      '🎨 Harika bir başlangıç! Bu fikri nasıl geliştirebiliriz?',
      '✨ İlham verici! Bunu farklı açılardan ele alalım.',
      '🌈 Yaratıcı bir düşünce! Daha da zenginleştirelim.',
      '🎭 Bu fikir çok renkli! Üzerine neler ekleyebiliriz?'
    ],
    humorous: [
      'Haha! 😄 Şaka bir yana, gerçekten yardımcı olmak isterim!',
      'Komiksin! 😂 Ama ciddiyetle, bu konuda ne düşünüyorsun?',
      'Esprili yaklaşım! 🎭 Şimdi ciddi konuşalım mı?',
      'Gülmekten konuşamıyorum! 😄 Ama şaka bir yana, sana yardımcı olabilirim!'
    ]
  };

  const personalityResponses = generalResponses[personality as keyof typeof generalResponses] || generalResponses.default;
  return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
}