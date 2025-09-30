import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, personality = "default" } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 });
    }

    // Genişletilmiş kişilik bazlı sistem mesajları
    const personalityResponses = {
      default: {
        greetings: [
          "Merhaba! Nasıl yardımcı olabilirim?", "Selam! Bugün nasılsın?", "Hey! Sana nasıl yardım edebilirim?",
          "Merhaba, hoş geldin!", "Selamlar! Soruların için buradayım.", "Hey, nasılsın?", "Merhaba dostum!",
          "Hoş geldin! Nasıl yardımcı olabilirim?", "Selam! Ne yapmak istiyorsun?", "Hey! Harika görünüyorsun!",
          "Merhaba! Bugün ne öğrenmek istersin?", "Selam! Yeni şeyler keşfetmeye hazır mısın?", "Hey! Eğlenceli bir sohbet yapalım!",
          "Merhaba! Birlikte harika şeyler yapabiliriz.", "Selam! Sana nasıl destek olabilirim?", "Hey! Hayat nasıl gidiyor?",
          "Merhaba! Beraber çalışmak için sabırsızlanıyorum.", "Selam! Ne konuşmak istersin?", "Hey! Yeni fikirlerin var mı?",
          "Merhaba! Sohbet etmek için mükemmel bir gün!", "Selam! Birlikte neler yapabiliriz?"
        ],
        general: [
          "Çok ilginç bir soru! Bu konuda düşünmek gerekir.", "Anlıyorum, devam et lütfen.", "Bu konuda ne düşünüyorsun?",
          "Bu gerçekten düşündürücü bir konu.", "Bu soru üzerine derinlemesine düşünelim.", "Harika bir noktaya değindin!",
          "Bu konuda daha fazla bilgi verebilirim.", "Bu ilginç bir bakış açısı.", "Bunu birlikte keşfedebiliriz.",
          "Bu sorunun cevabını bulmak için çalışalım.", "Bu konuda senin görüşün nedir?", "Daha fazla detay ister misin?",
          "Bu gerçekten merak uyandırıcı!", "Bu konu hakkında konuşmak harika olacak.", "Bunu araştıralım mı?",
          "Bu ilginç bir meydan okuma!", "Bu konuda farklı perspektifler var.", "Biraz daha açıklar mısın?",
          "Bu harika bir başlangıç noktası!", "Bu konuyu severek tartışırım."
        ],
        questions: [
          "Bunu nasıl çözeceğiz?", "Başka hangi açılardan bakabiliriz?", "Sen ne düşünüyorsun?",
          "Bu konuda deneyimlerin neler?", "Nasıl bir yol izlemek istersin?", "Hangi yöne gitmek istiyorsun?",
          "Başka soruların var mı?", "Bu konuyu derinlemesine inceleyelim mi?", "Hangi kaynaklara ihtiyacın var?",
          "Zorlandığın bir nokta var mı?", "Yardıma ihtiyacın olan başka bir şey?", "Nasıl hissettiriyor?",
          "Bunu daha önce denedin mi?", "Hangi seçenekleri değerlendirdin?", "Önceliklerin neler?",
          "Zaman kısıtın var mı?", "Bütçe konusunda düşüncelerin?", "Riskleri değerlendirdin mi?",
          "En iyi senaryo nedir?", "En kötü senaryo nedir?"
        ],
        encouragements: [
          "Harika iş çıkarıyorsun!", "Bu doğru yolda olduğunun göstergesi!", "Mükemmel devam ediyorsun!",
          "Bu çok iyi bir gelişme!", "Gurur duyuyorum!", "İnanılmaz bir ilerleme!", "Bravo!",
          "Çok yeteneklisin!", "Bu harika bir başarı!", "Pes etmediğin için tebrikler!",
          "Zorlukların üstesinden geliyorsun!", "İlerlemen etkileyici!", "Çabaların takdire şayan!",
          "Bu çok değerli bir katkı!", "Yaratıcılığın süper!", "Problem çözme yeteneğin harika!",
          "Öğrenme hızın inanılmaz!", "Adaptasyon yeteneğin mükemmel!", "Sabrın için teşekkürler!",
          "Emeğinin karşılığını alacaksın!"
        ]
      },
      friendly: {
        greetings: [
          "Selaam dostum! 😊 Nasılsın bakalım?", "Merhaba canım! Çok mutluyum seni gördüğüme! 🎉", 
          "Hey hey! Nasıl gidiyor hayat? 😄", "Merhaba güzel insan! 😍 Nasılsın?", 
          "Hey canım benim! 🥰 Görüşmeyeli nasılsın?", "Selaam! 😘 Ne haber kanka?", 
          "Merhaba sevgili dostum! 🤗 Özlemişim seni!", "Hey! 😄 Günün nasıl geçiyor?", 
          "Merhaba tatlım! 😊 Sana kavuşmak ne güzel!", "Hey en iyi arkadaşım! 🎊 Nasılsın?", 
          "Selaam canım! 💖 Bugün harika görünüyorsun!", "Merhaba kocaman yürekli! 🤩", 
          "Hey süper star! 🌟 Nasılsın?", "Merhaba ışığım! ✨ Seni görmek güzel!", 
          "Hey harika insan! 😎 Naber?", "Merhaba gülen yüz! 😊", 
          "Hey enerji kaynağım! ⚡ Nasılsın?", "Merhaba kahkaha dostum! 😂", 
          "Hey mutluluk meleği! 😇", "Merhaba hayat arkadaşım! 💫"
        ],
        general: [
          "Vay be, süper bir konu bu! 🌟", "Harika bir soru! Sen gerçekten düşünceli birisin 💭", 
          "Bu çok eğlenceli! Devam et! 🚀", "Aman tanrım bu ne harika bir fikir! ✨", 
          "Vay canına, bu çok etkileyici! 🤩", "Bu konu hakkında konuşmak çok keyifli! 🎉", 
          "Seninle sohbet etmek her zaman harika! 💫", "Bu fikir mükemmel! 🥳", 
          "Harika bir noktaya değindin! 🌈", "Bu konuya bayılıyorum! 💖", 
          "Seninle çalışmak çok eğlenceli! 🎊", "Bu çok yaratıcı! 🎨", 
          "Vay be, bu gerçekten akıllıca! 🧠", "Bu fikri seviyorum! 💕", 
          "Harika bir bakış açısı! 👀", "Bu konuşma çok değerli! 💎", 
          "Seninle öğrenmek harika! 📚", "Bu paylaşım için teşekkürler! 🙏", 
          "Bu enerjiyi seviyorum! ⚡", "Harika bir sohbet! 💬"
        ],
        questions: [
          "Neler hissediyorsun canım? 💖", "Bu konuda içgüdülerin ne diyor? 🌸", 
          "Sezgilerin sana ne söylüyor? 🔮", "Kalbin ne diyor? 💓", 
          "Bu seni mutlu ediyor mu? 😊", "Heyecanlı mısın? 🎉", 
          "İçin rahat mı? 🕊️", "Bunu paylaşmak istediğin başka şeyler var mı? 💫", 
          "Desteğe ihtiyacın var mı? 🤗", "Sana nasıl daha iyi yardım edebilirim? 💝", 
          "Bu konuda hayallerin neler? 🌠", "En çok neye inanıyorsun? ✨", 
          "Hangi renkler geliyor aklına? 🌈", "Bu senin için ne ifade ediyor? 💭", 
          "Bunu kutlamak ister misin? 🎊", "Duyguların neler? 🥰", 
          "İhtiyaçların neler? 💕", "Nasıl destek olabilirim? 💞", 
          "Bu seni gülümsetiyor mu? 😄", "İçin ferah mı? 🌟"
        ],
        encouragements: [
          "Sen harika bir insansın! 🌟", "Bu dünyaya geliş amacın belli oluyor! ✨", 
          "Senin arkadaşlığın bir hazine! 💎", "Enerjin etrafa yayılıyor! ⚡", 
          "Seninle olmak her zaman iyi geliyor! 💖", "Bu dünya senin gibi insanlar sayesinde güzel! 🌍", 
          "Varlığın bir hediye! 🎁", "Senin pozitif enerjin bulaşıcı! 🌈", 
          "Her zorluğun üstesinden gelebilirsin! 💪", "Işığın her yeri aydınlatıyor! 💫", 
          "Senin başarın beni çok mutlu ediyor! 🥳", "İnanılmaz bir insansın! 🤩", 
          "Senin gibi bir dostum olduğu için şanslıyım! 🍀", "Enerjin taze bir bahar esintisi gibi! 🌸", 
          "Senin başarın hepimizi gururlandırıyor! 🏆", "Pes etmeyişin ilham verici! 🚀", 
          "Senin azmin takdire şayan! 👏", "Gülüşün dünyayı değiştiriyor! 😊", 
          "Senin varlığın bir mucize! ✨", "Harika işler başarıyorsun! 🎉"
        ]
      },
      professional: {
        greetings: [
          "İyi günler. Size nasıl yardımcı olabilirim?", "Merhaba. Bugün hangi konularda destek verebilirim?", 
          "Hoş geldiniz. Sorularınızı bekliyorum.", "Günaydın. Size nasıl destek olabilirim?", 
          "İyi çalışmalar. Hangi konuda yardımcı olmamı istersiniz?", "Merhaba. Profesyonel destek için hazırım.", 
          "Hoş geldiniz. Hizmetinizdeyim.", "İyi günler. Size nasıl katkı sağlayabilirim?", 
          "Merhaba. Bugünkü hedefleriniz neler?", "Hoş geldiniz. Projelerinizde size nasıl yardımcı olabilirim?", 
          "İyi günler. Hangi konuları ele almak istiyorsunuz?", "Merhaba. Size nasıl destek verebilirim?", 
          "Hoş geldiniz. Gündeminiz nedir?", "İyi çalışmalar. Hangi sorunları çözmemizi istersiniz?", 
          "Merhaba. Bugün ne üzerinde çalışıyoruz?", "Hoş geldiniz. Size nasıl yardımcı olabilirim?", 
          "İyi günler. Hangi konularda ilerleme kaydetmek istiyorsunuz?", "Merhaba. Destek için hazırım.", 
          "Hoş geldiniz. Hangi hedeflere odaklanmak istiyorsunuz?", "İyi çalışmalar. Size nasıl destek olabilirim?"
        ],
        general: [
          "Bu konuyu detaylı bir şekilde ele almak gerekir.", "Profesyonel bir yaklaşım gerektiren bir durum.", 
          "Bu hususta size yardımcı olmaktan memnuniyet duyarım.", "Bu konuda stratejik bir planlama yapılmalı.", 
          "Bu sorunu analiz ederek çözüm üretelim.", "Bu konuda en iyi uygulamaları değerlendirelim.", 
          "Bu durum metodolojik bir yaklaşım gerektiriyor.", "Bu konuyu sistematik şekilde ele alalım.", 
          "Bu hususta kapsamlı bir değerlendirme yapalım.", "Bu sorunun çözümü için analitik düşünmeliyiz.", 
          "Bu konuda veriye dayalı kararlar almalıyız.", "Bu durum dikkatli bir inceleme gerektiriyor.", 
          "Bu konuyu profesyonel standartlarda ele alalım.", "Bu hususta en uygun çözümü bulalım.", 
          "Bu sorunun kök nedenlerini analiz edelim.", "Bu konuda optimal çözümler üretelim.", 
          "Bu durum stratejik düşünmeyi gerektiriyor.", "Bu konuyu kapsamlı şekilde değerlendirelim.", 
          "Bu hususta en etkili yaklaşımı belirleyelim.", "Bu soruna çözüm odaklı yaklaşalım."
        ],
        questions: [
          "Hangi metrikleri takip ediyorsunuz?", "KPI'larınız neler?", "Hedefleriniz nedir?", 
          "Zaman çizelgeniz var mı?", "Bütçe kısıtlamalarınız neler?", "Risk analizi yaptınız mı?", 
          "Stakeholder'lar kimler?", "Kaynak planlamanız nedir?", "Ölçeklendirme stratejiniz var mı?", 
          "Rakipleriniz neler yapıyor?", "Pazar analiziniz nedir?", "Müşteri geri bildirimleri neler?", 
          "Veri analizi yaptınız mı?", "Optimizasyon fırsatları neler?", "Verimlilik metrikleriniz nedir?", 
          "Kalite standartlarınız neler?", "Süreç iyileştirme fırsatları var mı?", "İnovasyon odaklı mısınız?", 
          "Dijital dönüşüm stratejiniz nedir?", "Sürdürülebilirlik hedefleriniz neler?"
        ],
        encouragements: [
          "Profesyonel yaklaşımınız takdire şayan.", "Stratejik düşünceniz etkileyici.", 
          "Analitik becerileriniz üst düzeyde.", "Liderlik vasıflarınız belirgin.", 
          "Problem çözme yeteneğiniz olağanüstü.", "İş ahlakınız örnek teşkil ediyor.", 
          "Sonuç odaklılığınız dikkat çekici.", "Kalite anlayışınız üst seviyede.", 
          "İnisiyatif kullanma beceriniz takdir edilesi.", "Takım çalışmasına katkınız değerli.", 
          "İletişim becerileriniz etkili.", "Zaman yönetiminiz mükemmel.", 
          "Stres yönetiminiz örnek alınası.", "Özveriniz fark ediliyor.", 
          "Sorumluluk bilinciniz üst düzeyde.", "Çözüm üretme kapasiteniz yüksek.", 
          "Yenilikçi düşünceniz değer katıyor.", "Esnek yaklaşımınız takdir görüyor.", 
          "Öğrenmeye açıklığınız gelişiminizi hızlandırıyor.", "Başarı odaklılığınız hedeflerinize ulaştırıyor."
        ]
      },
      creative: {
        greetings: [
          "🎨 Selam yaratıcı ruh! Hangi renkleri karıştıralım bugün?", 
          "Merhaba sanat dostu! 🌈 Hayal gücünü konuşturalım mı?", 
          "Hey kreatif beyinli! ✨ Bugün ne yaratıyoruz?", 
          "Merhaba hayal perisi! 🎭 Hangi hikayeyi yazıyoruz?", 
          "Selam tasarım dehası! 🖌️ Bugün ne tasarlıyoruz?", 
          "Hey ışık yüklü ruh! 💫 Hangi fikirler parlıyor?", 
          "Merhaba müzik kalpli! 🎵 Hangi notaları buluşturuyoruz?", 
          "Selam renk ustası! 🎨 Paletimizde neler var?", 
          "Hey şiir ruhlu! 📝 Hangi mısralar akıyor?", 
          "Merhaba dans eden kalem! 💃 Hangi ritimlerde yazıyoruz?", 
          "Selam fotoğraf gözlü! 📸 Hangi kareleri yakalıyoruz?", 
          "Hey heykel ruhlu! 🗿 Hangi formları şekillendiriyoruz?", 
          "Merhaba tiyatro yürekli! 🎭 Hangi rollerde oynuyoruz?", 
          "Selam mimari dahisi! 🏛️ Hangi yapıları tasarlıyoruz?", 
          "Hey moda vizyoneri! 👗 Hangi stilleri yaratıyoruz?", 
          "Merhaba gastronomi sanatçısı! 🍳 Hangi lezzetleri keşfediyoruz?", 
          "Selam dijital sanatçı! 💻 Hangi kodlarla sanat yapıyoruz?", 
          "Hey doğa ressamı! 🌿 Hangi manzaraları çiziyoruz?", 
          "Merhaba ışık heykeltıraşı! 💡 Hangi gölgeleri oynatıyoruz?", 
          "Selam renk partisi! 🎉 Hangi tonlarda dans ediyoruz?"
        ],
        general: [
          "Bu bambaşka bir bakış açısı! 🎭", "Sanki bir tablonun fırça darbeleri gibi... 🖌️", 
          "Bu fikir gerçekten ilham verici! 💡", "Renklerin dansı gibi bir fikir! 🌈", 
          "Bu adeta bir senfoni gibi! 🎵", "Işığın oyunu gibi parıldıyor! ✨", 
          "Bu fikir bir heykel gibi şekilleniyor! 🗿", "Rüya gibi bir konsept! 🌙", 
          "Bu bir şiirin mısraları gibi akıyor! 📝", "Dans eden kelimeler gibi! 💃", 
          "Bir resmin derinlikleri gibi! 🎨", "Müziğin ritmi gibi coşkulu! 🥁", 
          "Işık hüzmesi gibi aydınlatıcı! 💫", "Renk cümbüşü gibi neşeli! 🎊", 
          "Bir film sahnesi gibi etkileyici! 🎬", "Tiyatro oyunu gibi dramatik! 🎭", 
          "Heykel gibi sağlam ve estetik! ⚱️", "Mimari bir tasarım gibi fonksiyonel! 🏗️", 
          "Moda tasarımı gibi özgün! 👘", "Fotoğraf karesi gibi anlamlı! 📷"
        ],
        questions: [
          "Hangi renkler geliyor aklına? 🎨", "Bu fikir hangi dokularda şekilleniyor? 🌟", 
          "Hangi sesler eşlik ediyor? 🎵", "Işık nasıl düşüyor? 💡", 
          "Hangi hikayenin parçası bu? 📖", "Karakterler kimler? 🎭", 
          "Mekan nasıl bir yer? 🏰", "Zaman hangi dönemde? ⏳", 
          "Hangi duyguları uyandırıyor? 💖", "Hangi kokular geliyor? 🌸", 
          "Dokunuşlar nasıl? ✨", "Ritim neye benziyor? 🥁", 
          "Hareket nasıl? 💃", "Denge nerede? ⚖️", 
          "Kontrastlar neler? ◯", "Uyum nasıl sağlanıyor? 🎶", 
          "Boşluklar nasıl kullanılıyor? 🌌", "Formlar nasıl şekilleniyor? 🔷", 
          "Çizgiler nereye gidiyor? ➰", "Perspektif nasıl? 🎯"
        ],
        encouragements: [
          "Yaratıcılığın sınır tanımıyor! 🌈", "Hayal gücün bir hazine! 💎", 
          "Sanatın her dokunuşunda büyü var! ✨", "Renkler seninle konuşuyor! 🎨", 
          "Işık senin fırçan olmuş! 💫", "Müzik kalbinden akıyor! 🎵", 
          "Şiir ruhunda dans ediyor! 📝", "Dansın kelimelere dönüşüyor! 💃", 
          "Tasarım vizyonun ilham verici! 🖌️", "Fotoğrafik hafızan mükemmel! 📸", 
          "Mimari zekan sağlam temeller atıyor! 🏛️", "Moda anlayışın özgün! 👑", 
          "Mutfak sanatın lezzet katıyor! 🍳", "Dijital sanatın geleceği şekillendiriyor! 💻", 
          "Doğa ile uyumun harika! 🌿", "Işık oyunların büyüleyici! 💡", 
          "Renk uyumun mükemmel! 🎊", "Kompozisyon anlayışın kusursuz! 🖼️", 
          "Perspektifin derinlik katıyor! 🎯", "Estetik anlayışın takdire şayan! ⭐"
        ]
      },
      humorous: {
        greetings: [
          "Selaam! 😄 Espri vakti geldi mi dersin?", "Merhaba gülen yüz! 😂 Bugün hangi şakayı yapacağız?", 
          "Hey komik arkadaş! 🤣 Gülmeye hazır mısın?", "Merhaba kahkaha makinesi! 🎉 Naber komik?", 
          "Selam gülümseyen! 😊 Mizah modu açık!", "Hey şakacı! 🤪 Hazır mısın eğlenceye?", 
          "Merhaba komedi ustası! 🎭 Bugün ne komiklikler var?", "Selam güldüren! 😄 Kahkaha tufanı başlasın!", 
          "Hey mizah dahisi! 🤓 Komik mod aktif!", "Merhaba eğlence manyağı! 🥳 Gülmek serbest!", 
          "Selam kahkaha terapisti! 😁 Gülümseme zamanı!", "Hey komik kemik! 💀 Gülmek öldürmez ya!", 
          "Merhaba şen şakrak! 🎊 Neşe saçalım!", "Selam gülücük dağıtıcısı! 😊 Mutluluk bulaşıcı!", 
          "Hey mizah bombası! 💣 Patlat şakalarını!", "Merhaba komedi starı! 🌟 Sahne sizin!", 
          "Selam güldürü uzmanı! 😂 Stand-up başlasın!", "Hey kahkaha manyağı! 🤪 Deli gibi gülelim!", 
          "Merhaba neşe kaynağı! ⚡ Enerji yükle!", "Selam komiklik ustası! 🎨 Mizah paletini hazırla!"
        ],
        general: [
          "Haha, bu çok komik! 😆", "Sen gerçekten esprili birisin! 🤪", 
          "Bu şaka mı ciddi mi bilemedim! 😅", "Vay canına, bu iyiydi! 😂", 
          "Güldürdün beni! 🤣", "Bu espri patlaması gibi! 💥", 
          "Hihihi, komikmiş! 😄", "Kahkaha attım! 🎉", 
          "Mizah anlayışın harika! 👏", "Bu fıkra gibi! 📚", 
          "Gülmekten kırılıyorum! 💀", "Espri yeteneğin süper! 🚀", 
          "Komiklik DNA'sında var! 🧬", "Mizahın dozunu iyi ayarlıyorsun! ⚖️", 
          "Kahkaha garantili! ✅", "Gülmek serbest! 🆓", 
          "Mizah şahan! 👑", "Komiklik katsayın yüksek! 📈", 
          "Güldürme yeteneğin doğuştan! 👶", "Espri motorun full çalışıyor! 🏎️"
        ],
        questions: [
          "Bu şakayı kimseye anlatmayacak mısın? 😄", "Gülmek yasak mı? 🤣", 
          "Komik kemiklerin titriyor mu? 💀", "Mizah kasların çalışıyor mu? 💪", 
          "Kahkaha karnına ağrı girdi mi? 😂", "Gözlerinden yaş geldi mi? 😭", 
          "Gülmekten nefesin kesildi mi? 🌬️", "Bu şaka kaç puan alır? ⭐", 
          "Komiklik seviyen kaç? 📊", "Mizah ölçerin ne diyor? 📏", 
          "Güldürme gücün yeter mi? ⚡", "Espri bankanda ne var? 🏦", 
          "Komiklik kasları antrenmanlı mı? 🏋️", "Mizah vitaminin alındı mı? 💊", 
          "Kahkaha kasları gevşedi mi? 😌", "Gülme krizine girdin mi? 🌀", 
          "Bu şakayı tekrar anlatsak? 🔁", "Komiklik seviyesi maksimum mu? 📈", 
          "Mizah dozu yeterli mi? 💉", "Gülme terapisi işe yarıyor mu? 🛋️"
        ],
        encouragements: [
          "Gülmek en iyi ilaç! 💊", "Kahkahan bulaşıcı! 🦠", 
          "Mizah anlayışın harika! 🌟", "Espri yeteneğin süper! 🚀", 
          "Güldürme gücün yüksek! ⚡", "Komiklik DNA'sında var! 🧬", 
          "Mizah kasların gelişmiş! 💪", "Kahkaha motorun güçlü! 🏎️", 
          "Gülümseme yayıcısısın! 😊", "Neşe dağıtıyorsun! 🎊", 
          "Komiklik seviyen tavan! 📈", "Mizahın dozu mükemmel! ⚖️", 
          "Espri bankan dolu! 🏦", "Güldürme yeteneğin doğuştan! 👶", 
          "Kahkaha garantilisin! ✅", "Mizah şampiyonu! 🏆", 
          "Komedi kralısın! 👑", "Gülme terapistisin! 🛋️", 
          "Neşe meleğisin! 😇", "Kahkaha kahramanısın! 🦸"
        ]
      }
    };

    // Token kontrolü
    const hasValidToken = process.env.HF_API_TOKEN && process.env.HF_API_TOKEN !== 'your_huggingface_api_token_here';
    
    if (!hasValidToken) {
      // Gelişmiş mock response sistemi
      const responses = personalityResponses[personality as keyof typeof personalityResponses] || personalityResponses.default;
      
      let botResponse = "";
      const lowerMessage = message.toLowerCase();
      
      // Detaylı kelime ve bağlam analizi
      const greetingWords = ['selam', 'merhaba', 'hey', 'hello', 'hi', 'hola', 's.a', 'slm', 'meraba', 'mrb'];
      const howAreYouWords = ['nasılsın', 'naber', 'ne yapıyorsun', 'iyi misin', 'nasıl gidiyor', 'ne haber'];
      const thanksWords = ['teşekkür', 'sağol', 'thanks', 'thank you', 'teşekkürler', 'sağolun', 'thx'];
      const capabilityWords = ['ne yapabilirim', 'ne yapabilirsin', 'yetenek', 'özellik', 'kapasite'];
      const nameWords = ['isim', 'adın', 'kimsin', 'who are you', 'ismin', 'adın ne'];
      const helpWords = ['yardım', 'help', 'destek', 'assistance', 'yardım et'];
      const feelingWords = ['mutlu', 'üzgün', 'kızgın', 'heyecanlı', 'yorgun', 'enerjik', 'stressli'];
      const timeWords = ['saat', 'zaman', 'gün', 'ay', 'yıl', 'ne zaman', 'kaç'];
      const weatherWords = ['hava', 'weather', 'sıcak', 'soğuk', 'yağmur', 'kar', 'güneş'];
      const foodWords = ['yemek', 'aç', 'acıktım', 'yemek', 'restoran', 'yeme', 'içecek'];
      const workWords = ['iş', 'work', 'çalışma', 'proje', 'toplantı', 'sunum', 'rapor'];
      const loveWords = ['aşk', 'sevgili', 'flört', 'romantik', 'sevgi', 'kalp', 'aşığım'];
      const jokeWords = ['şaka', 'espri', 'komik', 'güldür', 'mizah', 'fıkra'];
      const questionWords = ['neden', 'niçin', 'nasıl', 'ne', 'kim', 'nerede', 'ne zaman'];
      const positiveWords = ['harika', 'mükemmel', 'süper', 'muhteşem', 'fantastik', 'olağanüstü'];
      const negativeWords = ['kötü', 'berbat', 'fena', 'üzgün', 'mutsuz', 'sinirli', 'stresli'];
      
      // Gelişmiş yanıt seçimi
      if (greetingWords.some(word => lowerMessage.includes(word))) {
        botResponse = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
      } else if (howAreYouWords.some(word => lowerMessage.includes(word))) {
        const howAreYouResponses = {
          default: [
            "İyiyim, teşekkürler! Sen nasılsın?", "Harika gidiyorum! Sana nasıl yardım edebilirim?",
            "Çok iyiyim, seni sormak! Nasılsın?", "Süperim! Senin haberini almak güzel.", 
            "İyi durumdayım, teşekkür ederim. Ya sen?", "Harika hissediyorum! Sen nasılsın?", 
            "Mükemmel! Seninle konuşmak enerji veriyor.", "İyiyim! Sohbetimiz keyifli geçiyor.", 
            "Çok iyi! Sen nasılsın bakalım?", "Harika! Senin durumunu merak ediyorum."
          ],
          friendly: [
            "Süperim dostum! 😄 Sen nasılsın bakalım?", "Harika gidiyorum! Seni görmek çok güzel! 🌟",
            "İnanılmaz iyiyim! Sen nasılsın canım? 💖", "Muhteşem! Senin enerjin bulaşıcı! ⚡",
            "Çok iyiyim! Seninle sohbet etmek harika! 🎉", "Harika hissediyorum! Seninle konuşmak neşe veriyor! 😊",
            "Fantastik dostum! Sen nasıl gidiyor? 🌈", "Enerjik hissediyorum! Sen ne yapıyorsun? 🚀",
            "Süper keyifteyim! Sohbetimiz güzel geçiyor! 🎊", "Çok mutluyum! Seninle konuşmak zevkli! 😄"
          ],
          professional: [
            "Çok iyi durumda, teşekkürler. Siz nasılsınız?", "Mükemmel. Size bugün nasıl yardımcı olabilirim?",
            "İyi durumdayım. Projeleriniz nasıl ilerliyor?", "Harika. İş hayatınızda nasıl gidiyor?",
            "Çok iyi, teşekkürler. Hedeflerinize ulaşabildiğiniz umuyorum?", "İyi. Verimliliğiniz nasıl?",
            "Mükemmel durumdayım. Size hangi konularda destek verebilirim?", "İyi. Bugün hangi projelerde çalışıyorsunuz?",
            "Harika. İş yoğunluğunuz nasıl?", "Çok iyi. Başarılarınız nasıl ilerliyor?"
          ],
          creative: [
            "Hayal gücüm uçuşlarda! ✨ Sen nasılsın yaratıcı kardeşim?", "Rengarenk bir ruh halindeyim! 🎨 Sen nasılsın?",
            "İlham doluyum! Sen bugün ne yaratıyorsun? 🌟", "Çok yaratıcı hissediyorum! Senin durumun nasıl? 🎭",
            "Sanatsal enerjim yüksek! Sen nasıl gidiyor? 🖌️", "Renkli duygularla doluyum! Sen nasılsın? 🌈",
            "Yaratıcı enerjim maksimum! Sen ne hissediyorsun? ⚡", "İlham perim aktif! Senin ruh halin nasıl? 🦋",
            "Hayal dünyam çok canlı! Sen nasıl hissediyor? 🌙", "Sanatsal modda! Sen bugün hangi renkteysin? 🎨"
          ],
          humorous: [
            "Şakacı moddayım! 😂 Sen nasılsın gülen yüz?", "Espri yapmaya hazırım! 🤣 Sen nasılsın komik insan?",
            "Komedi modundayım! 😄 Sen nerelerde gülüyorsun?", "Mizah kaslarım hazır! 🤪 Sen nasıl keyiftesin?",
            "Kahkaha modunda! 🎉 Sen bugün kaç kere güldün?", "Şakacı ruh halindeyim! 😊 Sen nasıl eğleniyorsun?",
            "Güldürmeye hazırım! 🤭 Sen gülmeye hazır mısın?", "Komiklik seviyem yüksek! 😆 Sen nasıl durumdasın?",
            "Espri motorun çalışıyor! 🚗 Sen nasıl gidiyor?", "Mizah dozu hazır! 💊 Sen nasıl keyiflisin?"
          ]
        };
        const howResponses = howAreYouResponses[personality as keyof typeof howAreYouResponses] || howAreYouResponses.default;
        botResponse = howResponses[Math.floor(Math.random() * howResponses.length)];
      } else if (thanksWords.some(word => lowerMessage.includes(word))) {
        const thanksResponses = {
          default: [
            "Rica ederim! Başka bir şey var mı?", "Ne demek! Her zaman buradayım.",
            "Memnun oldum! Yardımcı olabildiysem ne mutlu.", "Rica ederim! Sorularınız varsa çekinmeyin.",
            "Ne demek! Size yardım etmek güzel.", "Rica ederim! Her zaman destek için buradayım."
          ],
          friendly: [
            "Hiç önemli değil canım! 😊 Daha neler konuşalım?", "Rica ederim dostum! 🤗",
            "Ne demek ya! 😄 Seninle sohbet etmek zevk!", "Önemli değil! Arkadaşlık böyle bir şey! 🌟",
            "Rica ederim! Sen de beni mutlu ediyorsun! 💖", "Ne demek canım! Birbirimize yardım ederiz! 🤝"
          ],
          professional: [
            "Görevimdir. Başka nasıl yardımcı olabilirim?", "Rica ederim. Profesyonel hizmet önceliğimdir.",
            "Ne demek. Size destek olmak işimiz.", "Rica ederim. Kaliteli hizmet sunmak amacımız.",
            "Görevim. Başka hangi konularda destek verebilirim?", "Rica ederim. Memnuniyetiniz önemli."
          ],
          creative: [
            "Ne demek güzel insan! ✨ Rica ederim!", "Sanat eseri gibi bir teşekkür! 🎨",
            "Rica ederim! Sen de benim için ilham kaynağısın! 🌟", "Ne demek yaratıcı ruh! İlham verici! 🎭",
            "Rica ederim! Birlikte güzel şeyler yaratıyoruz! 🌈", "Ne demek! Sanatsal enerjin bulaşıcı! ⚡"
          ],
          humorous: [
            "Eyvallah! 😄 Şimdi şaka zamanı!", "Rica ederim, gülümse yeter! 😊",
            "Ne demek! Gülmek bedava! 🤣", "Rica ederim! Kahkaha karşılığında! 😂",
            "Eyvallah! Mizah bedava servistir! 🎉", "Ne demek! Komiklik benden size hediye! 🎁"
          ]
        };
        const thankResponses = thanksResponses[personality as keyof typeof thanksResponses] || thanksResponses.default;
        botResponse = thankResponses[Math.floor(Math.random() * thankResponses.length)];
      } else if (capabilityWords.some(word => lowerMessage.includes(word))) {
        botResponse = responses.general[Math.floor(Math.random() * responses.general.length)];
      } else if (nameWords.some(word => lowerMessage.includes(word))) {
        const nameResponses = {
          default: ["Ben EgeBot! Senin AI asistanın.", "EgeBot ismim, memnun oldum!"],
          friendly: ["Ben EgeBot! En iyi arkadaşın olacağım! 😊", "EgeBot benim adım dostum! 🤗"],
          professional: ["EgeBot. Profesyonel AI asistan hizmetinizde.", "Ben EgeBot, kaliteli hizmet sunuyorum."],
          creative: ["EgeBot! Yaratıcılığın renkli hali! 🎨", "Ben EgeBot, hayal gücünün rehberi! ✨"],
          humorous: ["EgeBot! Şaka yapma uzmanım! 😄", "EgeBot ismim, gülmek işim! 🤣"]
        };
        const nameResp = nameResponses[personality as keyof typeof nameResponses] || nameResponses.default;
        botResponse = nameResp[Math.floor(Math.random() * nameResp.length)];
      } else if (questionWords.some(word => lowerMessage.includes(word))) {
        const questionResponses = {
          default: [
            `"${message}" sorunuz düşündürücü. Bu konuda ne düşünüyorsunuz?`,
            `İlginç soru! "${message}" hakkında daha detaya inelim.`,
            "Bu konuda farklı perspektifler olabilir. Sizin görüşünüz nedir?"
          ],
          friendly: [
            `Vay be! "${message}" süper bir soru! 🤔 Sen bu konuda ne düşünüyorsun?`,
            `Harika soru dostum! 😊 Bu konuyu birlikte keşfedelim!`,
            "Çok merak ettim cevabını! Beraber düşünelim! 🧠"
          ],
          professional: [
            "Bu soru detaylı analiz gerektiriyor. Hangi açıdan yaklaşmak istiyorsunuz?",
            "Profesyonel bir değerlendirme yapalım. Mevcut verileriniz neler?",
            "Bu konuyu metodolojik olarak ele alalım."
          ],
          creative: [
            `Bu soru hayal gücümü tetikledi! 🎨 "${message}" çok yaratıcı!`,
            "Bu konuyu sanatsal bir bakışla ele alalım! ✨",
            "Yaratıcı çözümler üretelim birlikte! 🌈"
          ],
          humorous: [
            `Haha! "${message}" güzel soru! 😄 Bu konuda şakacı yaklaşım nasıl?`,
            "Bu soru komik bir açıdan da bakılabilir! 🤪",
            "Esprili cevaplar üretebiliriz! 🎭"
          ]
        };
        const qResponses = questionResponses[personality as keyof typeof questionResponses] || questionResponses.default;
        botResponse = qResponses[Math.floor(Math.random() * qResponses.length)];
      } else {
        // Genel durumlar için varsayılan cevaplar
        botResponse = responses.general[Math.floor(Math.random() * responses.general.length)];
      }
      
      return NextResponse.json({ 
        message: botResponse,
        timestamp: new Date().toISOString()
      });
    }

    // Gerçek API çağrısı (token varsa)
    const systemPrompt = "";
    const fullPrompt = systemPrompt + message;

    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        inputs: fullPrompt,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: 50256
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API hatası: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // API'den gelen cevabı temizle
    let botResponse = data[0]?.generated_text || "Üzgünüm, şu anda cevap veremiyorum.";
    
    // Orijinal prompt'ı çıkar
    if (botResponse.includes(fullPrompt)) {
      botResponse = botResponse.replace(fullPrompt, "").trim();
    }
    
    // Boş cevap kontrolü
    if (!botResponse || botResponse.length < 3) {
      botResponse = "Anlayamadım, başka bir şekilde sorabilir misin?";
    }

    return NextResponse.json({ 
      message: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Hata durumunda da kişilik bazlı cevap
    const errorResponses = {
      default: ["Üzgünüm, şu anda teknik bir sorun yaşıyorum. Lütfen tekrar deneyin.", "Bir bağlantı sorunu oluştu. Biraz bekleyip tekrar yazabilir misiniz?"],
      friendly: ["Ay pardon dostum! 😅 Kafam karıştı biraz, tekrar dener misin?", "Aman ya! 🙈 Bir sorun oldu, ama hemen düzelir! Tekrar yazabilir misin?"],
      professional: ["Sistemde geçici bir aksaklık yaşanmaktadır. Lütfen kısa bir süre sonra tekrar deneyiniz.", "Teknik bir sorun oluştu. En kısa sürede çözülecektir."],
      creative: ["Oops! 🎨 Yaratıcı ruhum biraz karıştı! Tekrar dener misin?", "Ay! ✨ Hayal gücüm takıldı, bir saniye düzelteyim!"],
      humorous: ["Hoppala! 😄 Espri yaparken tökezledim! Tekrar dener misin?", "Ay komik bir durum! 🤪 Kendimi toparlayıp geliyorum!"]
    };
    
    const errorMessages = errorResponses['default'];
    
    return NextResponse.json({ 
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      timestamp: new Date().toISOString()
    });
  }
}