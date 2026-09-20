import { RoomData } from '../types';

export const ROOMS_DATA: Record<string, RoomData> = {
  hangar: {
    id: 'hangar',
    title: 'HANGAR',
    subtitle: 'Giriş Kapısı & Mekik Deposu',
    badgeIcon: 'shuttle-space',
    pos: { x: -7.5, y: 1.0, z: -5.5 },
    size: { x: 7.0, y: 2.0, z: 3.6 },
    color: 0x0284c7,
    capacity: '60 Kişi',
    doors: ['Köprü / Cowork (Sağ)'],
    desc: 'Uzay gemisinin ilk ana giriş kapısına ev sahipliği yapan devasa hangar. Dronlar, prototipler ve imalat araçları için özel rampalara sahiptir.',
    features: ['Giriş Kapısı Rampası', '3D Yazıcı Çiftliği', 'Dron Test Sahası', 'Robotik Montaj'],
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    type: 'hangar'
  },
  kopru: {
    id: 'kopru',
    title: 'KÖPRÜ (COWORK)',
    subtitle: 'Ortak Çalışma & Komuta',
    badgeIcon: 'diagram-project',
    pos: { x: -0.5, y: 1.0, z: -5.5 },
    size: { x: 6.0, y: 2.0, z: 3.6 },
    color: 0x06b6d4,
    capacity: '35 Kişi',
    doors: ['Hangar (Sol =)', 'Science Kafe (Sağ =)'],
    desc: 'Hangar ile Science Kafe arasında yer alan ortak çalışma (cowork) ve komuta merkezi. Proje takımları için modüler masalara sahiptir.',
    features: ['Modüler Cowork Masaları', 'Holografik Sunum', 'Kaptan Masası', 'Yüksek Hızlı Fiber'],
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    type: 'kopru'
  },
  science_kafe: {
    id: 'science_kafe',
    title: 'SCIENCE KAFE',
    subtitle: 'Sosyal Dinlenme & Kafe',
    badgeIcon: 'mug-hot',
    pos: { x: 6.5, y: 1.0, z: -5.5 },
    size: { x: 6.5, y: 2.0, z: 3.6 },
    color: 0x10b981,
    capacity: '30 Kişi',
    doors: ['Köprü (Sol =)', 'Kiler (Alt =)', 'Keşif Güvertesi (Alt =)'],
    desc: 'Geminin üst sağ aksında bulunan sosyal kafe. Kahve barı, bilim kütüphanesi ve keşif güvertesine bağlanan geçiş kapıları bulunur.',
    features: ['Moleküler Kahve Barı', 'Sohbet Locaları', 'Akıllı Yiyecek İkmali', 'Astro-Kütüphane'],
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    type: 'kafe'
  },
  kic_wc: {
    id: 'kic_wc',
    title: 'KIÇ WC',
    subtitle: 'Arka Islak Alan',
    badgeIcon: 'restroom',
    pos: { x: -8.0, y: 1.0, z: 0.0 },
    size: { x: 2.8, y: 2.0, z: 2.8 },
    color: 0x64748b,
    capacity: 'Servis',
    doors: ['Üst Koridor (=)'],
    desc: 'Geminin kıç (arka) kısmındaki üst koridordan erişilen hijyen ve kişisel bakım ünitesi.',
    features: ['Sensörlü Dezenfeksiyon', 'Su Geri Dönüşüm', 'Soyunma Dolapları'],
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    type: 'wc'
  },
  makine_dairesi: {
    id: 'makine_dairesi',
    title: 'MAKİNE DAİRESİ',
    subtitle: 'Enerji & Reaktör Çekirdeği',
    badgeIcon: 'bolt',
    pos: { x: -4.2, y: 1.0, z: 0.0 },
    size: { x: 4.2, y: 2.0, z: 2.8 },
    color: 0xef4444,
    capacity: 'Teknik Personel',
    doors: ['Üst Koridor (=)', 'Pruva WC (Sağ)'],
    desc: 'Kıç WC yanında konumlanmış, geminin ana füzyon reaktörü ile kuantum sunucularını barındıran teknik enerji merkezi.',
    features: ['Plazma Füzyon Reaktörü', 'Kuantum Sunucu Kabinleri', 'Güç Dağıtım Ünitesi'],
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    type: 'makine'
  },
  pruva_wc: {
    id: 'pruva_wc',
    title: 'PRUVA WC',
    subtitle: 'Ön Islak Alan',
    badgeIcon: 'restroom',
    pos: { x: -1.0, y: 1.0, z: 0.0 },
    size: { x: 2.0, y: 2.0, z: 2.8 },
    color: 0x475569,
    capacity: 'Servis',
    doors: ['Makine Dairesi (Sol)', 'Yaratım Kabini (Sağ)'],
    desc: 'Makine dairesi ile Yaratım kabini arasında yer alan ön hijyen ünitesi.',
    features: ['Otomatik Temizlik', 'Eko Hijyen'],
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    type: 'wc'
  },
  tanitim_kabini: {
    id: 'tanitim_kabini',
    title: 'YARATIM KABİNİ',
    subtitle: 'Ziyaretçi & VR Deneyim',
    badgeIcon: 'circle-play',
    pos: { x: -6.5, y: 1.0, z: 5.5 },
    size: { x: 5.5, y: 2.0, z: 3.8 },
    color: 0x14b8a6,
    capacity: '20 Kişi',
    doors: ['Keşif Güvertesi (Sağ =)', 'Pruva WC (Üst)'],
    desc: 'Gemiye gelen misafirlerin ve öğrencilerin VR gözlüklerle akademi turlarını deneyimlediği interaktif Yaratım merkezi.',
    features: ['İnteraktif Holo-Ekran', 'VR Akademi Turu', 'Kayıt Bankosu'],
    img: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80',
    type: 'tanitim'
  },
  kiler: {
    id: 'kiler',
    title: 'KİLER / ERZAK',
    subtitle: 'Lojistik & Depo',
    badgeIcon: 'boxes-stacked',
    pos: { x: 1.8, y: 1.0, z: 0.0 },
    size: { x: 3.0, y: 2.0, z: 2.8 },
    color: 0x8b5cf6,
    capacity: 'Lojistik',
    doors: ['Science Kafe (Üst =)', 'Köşk (Sağ =)'],
    desc: 'Science Kafe ile Seyir Odası arasında konumlandırılmış, donanım, yedek parça ve erzak deposu.',
    features: ['Otomatik Parça Deposu', 'ESD Güvenli Raflar', 'Soğuk İkmal Ünitesi'],
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    type: 'kiler'
  },
  kosk_seyir: {
    id: 'kosk_seyir',
    title: 'SEYİR ODASI (KÖŞK B/K)',
    subtitle: 'Panoramik Yıldız İzleme',
    badgeIcon: 'eye',
    pos: { x: 6.5, y: 1.0, z: 0.0 },
    size: { x: 6.5, y: 2.0, z: 2.8 },
    color: 0xf59e0b,
    capacity: '25 Kişi',
    doors: ['Kiler (Sol =)', 'Science Kafe (Üst)'],
    desc: 'Kilerin hemen yanında, geminin ön açısına bakan köşk ve seyir odası. Yıldız gözlemleri ve özel toplantılar için kullanılır.',
    features: ['Panoramik Ön Cam', 'Sıfır Yerçekimi Koltuklar', 'Yıldız Haritası Projeksiyonu'],
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    type: 'seyir'
  },
  kesif_guvertesi: {
    id: 'kesif_guvertesi',
    title: 'KEŞİF GÜVERTESİ / SINIF',
    subtitle: 'İnteraktif Akademi Dersliği',
    badgeIcon: 'graduation-cap',
    pos: { x: 3.2, y: 1.0, z: 5.5 },
    size: { x: 9.5, y: 2.0, z: 3.8 },
    color: 0xec4899,
    capacity: '45 Kişi',
    doors: ['Science Kafe (Üst =)', 'Yaratım Kabini (Sol =)'],
    desc: 'Geminin en alt sağ kısmında yer alan geniş uzay dersliği. Yazılım, yapay zeka ve uzay bilimleri eğitimleri burada verilir.',
    features: ['Holografik Akıllı Tahta', '30 Kişilik VR İstasyon', 'Akıllı Sıralar'],
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    type: 'sinif'
  }
};

export const DOOR_CONNECTIONS = [
  // Köprü <-> Hangar, Science Kafe
  { from: 'hangar', to: 'kopru' },
  { from: 'kopru', to: 'science_kafe' },
  // Science Kafe <-> Kiler, Keşif Güvertesi
  { from: 'science_kafe', to: 'kiler' },
  { from: 'science_kafe', to: 'kesif_guvertesi' },
  // Kiler <-> Köşk
  { from: 'kiler', to: 'kosk_seyir' },
  // Yaratım Kabini <-> Keşif Güvertesi
  { from: 'tanitim_kabini', to: 'kesif_guvertesi' },
  // Makine Dairesi <-> Pruva WC <-> Kiç WC
  { from: 'kic_wc', to: 'makine_dairesi' },
  { from: 'makine_dairesi', to: 'pruva_wc' },
  { from: 'pruva_wc', to: 'tanitim_kabini' }
];
