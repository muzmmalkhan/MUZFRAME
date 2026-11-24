import baratCelebrationImg from '../assets/images/hero_barat_celebration_1794830201886.jpg';
import mehndiNightImg from '../assets/images/portfolio_mehndi_night_1794830202376.jpg';
import walimaPortraitImg from '../assets/images/portfolio_walima_portrait_1794830201916.jpg';
import bridalPortraitImg from '../assets/images/portfolio_bridal_portrait_1794830203228.jpg';
import droneVenueImg from '../assets/images/portfolio_drone_venue_1794830204035.jpg';
import preweddingGoldenImg from '../assets/images/portfolio_prewedding_golden_1794830204506.jpg';
import showreelCinemaImg from '../assets/images/showreel_cinema_rig_1794830204091.jpg';

const bridalMehndiDetailsImg = '/assets/aistudio/WhatsApp_Image_2026-10-25_at_12.57.21_PM_a2784729.jpeg';

export type PortfolioCategory =
  | 'All'
  | 'Mehndi'
  | 'Barat'
  | 'Walima'
  | 'Bridal'
  | 'Pre-wedding'
  | 'Drone';

export interface PortfolioItem {
  id: string;
  title: string;
  coupleOrClient: string;
  category: Exclude<PortfolioCategory, 'All'>;
  location: string;
  year: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  aspectClass: string;
  cameraGear: string;
  story: string;
  featuredOnHome?: boolean;
}

export interface HeroSlideItem {
  id: string;
  image: string;
  alt: string;
  caption: string;
  location: string;
  category: string;
  objectPosition: string;
}

export interface ShowreelHighlight {
  id: string;
  title: string;
  couple: string;
  duration: string;
  location: string;
  resolution: string;
  thumbnail: string;
  alt: string;
  summary: string;
  chapters: { time: string; label: string }[];
}

export interface ClientReview {
  id: string;
  clientName: string;
  eventType: string;
  location: string;
  date: string;
  packageUsed: string;
  quote: string;
  outcome: string;
}

export interface TrustedPartner {
  id: string;
  name: string;
  sector: string;
  location: string;
  scope: string;
  metric: string;
  summary: string;
}

export const PORTFOLIO_ASSETS = {
  baratCelebrationImg,
  mehndiNightImg,
  walimaPortraitImg,
  bridalPortraitImg,
  droneVenueImg,
  preweddingGoldenImg,
  showreelCinemaImg,
  bridalMehndiDetailsImg,
};

const bridalShoeDetailImg = '/assets/aistudio/Henna-Adorned_Bridal_Shoe_Detail_aec57c6c.png';
const brandLaunchPortraitImg = '/assets/aistudio/JM.jpg_d870a132.jpeg';
const commercialPortraitImg = '/assets/aistudio/Studio_Portrait_with_Branded_Water_Bottle_751aa852.png';
const northernCrewTourImg = '/assets/aistudio/gbn.jpg_59047e3a.jpeg';

export const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'slide-bridal-details',
    image: bridalMehndiDetailsImg,
    alt: 'Intricate bridal henna patterns on feet and embroidered lehenga hem detail photographed by MuzFrame Studio',
    caption: 'Bridal Mehndi & Couture Details',
    location: 'Hasilpur, Punjab',
    category: 'Bridal Editorial',
    objectPosition: 'center 55%',
  },
  {
    id: 'slide-bridal-shoe',
    image: bridalShoeDetailImg,
    alt: 'Henna-adorned bridal hands fastening pearl bridal heel over crimson zardozi lehenga',
    caption: 'Bridal Jewelry, Mehndi & Pearl Heel Detail',
    location: 'Hasilpur Bridal Suite',
    category: 'Bridal Special',
    objectPosition: 'center 45%',
  },
  {
    id: 'slide-brand-launch',
    image: brandLaunchPortraitImg,
    alt: 'MuzFrame Studio commercial fashion and store launch campaign portraits',
    caption: 'Commercial Campaign & Brand Launch',
    location: 'Hasilpur Commercial',
    category: 'Brand Campaign',
    objectPosition: '78% 20%',
  },
  {
    id: 'slide-commercial-portrait',
    image: commercialPortraitImg,
    alt: 'MuzFrame Studio commercial event and branded portrait session',
    caption: 'Corporate & Brand Event Portraits',
    location: 'Southern Punjab',
    category: 'Commercial',
    objectPosition: '75% 20%',
  },
  {
    id: 'slide-northern-crew',
    image: northernCrewTourImg,
    alt: 'MuzFrame Studio production crew on destination shoot across northern Pakistan mountains',
    caption: 'MuzFrame Crew · Destination Productions',
    location: 'Northern Pakistan',
    category: 'Destination Shoot',
    objectPosition: '78% 25%',
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'work-barat-royal',
    title: 'Grand Barat Procession & Fireworks',
    coupleOrClient: 'Hamza & Ayesha',
    category: 'Barat',
    location: 'Hasilpur, Punjab',
    year: '2026',
    image: baratCelebrationImg,
    alt: 'Groom entering illuminated wedding marquee on Barat night surrounded by traditional dhol players and family',
    width: 1600,
    height: 900,
    aspectClass: 'aspect-[16/10]',
    cameraGear: 'Sony A7IV · 35mm f/1.4 GM',
    story: 'Full multi-camera Barat entrance covered with wide-angle low-light primes, handheld gimbal tracking, and synchronized audio recording.',
    featuredOnHome: true,
  },
  {
    id: 'work-bridal-portrait',
    title: 'Crimson Zardozi Bridal Monograph',
    coupleOrClient: 'Sana Tariq',
    category: 'Bridal',
    location: 'Bahawalpur, Punjab',
    year: '2026',
    image: bridalPortraitImg,
    alt: 'Pakistani bride in crimson embroidered zardozi lehenga and kundan jewelry photographed with soft directional lighting',
    width: 1200,
    height: 1600,
    aspectClass: 'aspect-[3/4]',
    cameraGear: 'Sony A7IV · 85mm f/1.4 · Female Crew',
    story: 'Private bridal getting-ready portrait session photographed exclusively by our female photography lead prior to the Barat arrival.',
    featuredOnHome: true,
  },
  {
    id: 'work-mehndi-dholki',
    title: 'Marigold Dholki & Mehndi Night',
    coupleOrClient: 'Bilal & Fatima',
    category: 'Mehndi',
    location: 'Hasilpur, Punjab',
    year: '2026',
    image: mehndiNightImg,
    alt: 'Pakistani Mehndi ceremony with marigold flower curtains, brass dholki and candid family celebration',
    width: 1400,
    height: 1050,
    aspectClass: 'aspect-[4/3]',
    cameraGear: 'Sony FX3 · 24-70mm f/2.8 GM II',
    story: 'Warm ambient night coverage preserving genuine family laughter, traditional dholki rhythms, and marigold courtyard decor without harsh flash.',
    featuredOnHome: true,
  },
  {
    id: 'work-walima-portrait',
    title: 'Candlelit Walima Couple Walk',
    coupleOrClient: 'Usman & Hira',
    category: 'Walima',
    location: 'Bahawalpur, Punjab',
    year: '2026',
    image: walimaPortraitImg,
    alt: 'Bride and groom smiling together in ivory and champagne gold attire at candlelit Walima reception hall',
    width: 1400,
    height: 1050,
    aspectClass: 'aspect-[4/3]',
    cameraGear: 'Dual Mirrorless · 50mm f/1.2 GM',
    story: 'Calm editorial couple portraits captured 20 minutes before guest reception opening, utilizing venue candlelight and floral aisle framing.',
    featuredOnHome: true,
  },
  {
    id: 'work-drone-marquee',
    title: 'Twilight Aerial Marquee Panorama',
    coupleOrClient: 'Chaudhry Family Wedding',
    category: 'Drone',
    location: 'Chishtian, Punjab',
    year: '2026',
    image: droneVenueImg,
    alt: '4K aerial drone view at twilight showing an illuminated wedding lawn and marquee surrounded by green fields',
    width: 1600,
    height: 900,
    aspectClass: 'aspect-[16/9]',
    cameraGear: 'DJI Mavic 3 Cine · 4K ProRes',
    story: 'Blue-hour establishing flight capturing the scale of the marquee lighting and garden setup for the opening sequence of the wedding film.',
    featuredOnHome: true,
  },
  {
    id: 'work-prewedding-arches',
    title: 'Sandstone Courtyard Golden Hour',
    coupleOrClient: 'Saad & Mahnoor',
    category: 'Pre-wedding',
    location: 'Cholistan Heritage Route',
    year: '2026',
    image: preweddingGoldenImg,
    alt: 'Couple posing in warm sunset light framed by traditional carved sandstone arches during pre-wedding session',
    width: 1400,
    height: 1050,
    aspectClass: 'aspect-[4/3]',
    cameraGear: 'Sony A7IV · 35mm Prime',
    story: 'Late-afternoon architectural portrait session timed for natural backlit shadows across carved sandstone arches.',
    featuredOnHome: true,
  },
  {
    id: 'work-bridal-henna',
    title: 'Bridal Henna & Couture Details',
    coupleOrClient: 'Zainab Nikkah',
    category: 'Bridal',
    location: 'Hasilpur, Punjab',
    year: '2026',
    image: bridalMehndiDetailsImg,
    alt: 'Close-up of bridal feet adorned with red mehndi, golden heels and embroidered pink lehenga border',
    width: 1600,
    height: 900,
    aspectClass: 'aspect-[16/9]',
    cameraGear: 'Macro 90mm · Natural Daylight',
    story: 'Detail study of hand-applied bridal mehndi and zardozi hem work photographed prior to the Nikkah ceremony.',
    featuredOnHome: false,
  },
  {
    id: 'work-cinema-bts',
    title: 'Gimbal Tracking the Royal Entrance',
    coupleOrClient: 'Faisal & Maryam',
    category: 'Barat',
    location: 'Vehari, Punjab',
    year: '2026',
    image: showreelCinemaImg,
    alt: 'MuzFrame cinematographer tracking couple wedding walk with gimbal-mounted mirrorless camera under chandeliers',
    width: 1600,
    height: 900,
    aspectClass: 'aspect-[16/9]',
    cameraGear: 'Sony FX3 · RS3 Pro Gimbal',
    story: 'Live single-take entrance tracking shot combining synchronized wireless audio with stabilized 4K 60fps cinema capture.',
    featuredOnHome: false,
  },
];

export const MAIN_SHOWREEL: ShowreelHighlight = {
  id: 'showreel-2026',
  title: 'MuzFrame 2026 Wedding Cinema Reel',
  couple: 'Featured Highlights from Hasilpur, Bahawalpur & Vehari',
  duration: '02:18',
  location: 'Punjab Wedding Season',
  resolution: '4K UHD · Color Graded',
  thumbnail: showreelCinemaImg,
  alt: 'Cinematographer filming a Pakistani couple entrance on gimbal during a grand chandelier-lit wedding',
  summary: 'A curated two-minute highlight reel combining 4K gimbal entrances, twilight drone establishing shots, vows audio, and Mehndi dholki celebrations.',
  chapters: [
    { time: '00:00', label: 'Twilight Drone Venue Reveal' },
    { time: '00:28', label: 'Bridal Getting Ready & Mehndi Details' },
    { time: '01:02', label: 'Mehndi Dholki & Courtyard Dance' },
    { time: '01:36', label: 'Barat Grand Entrance & Fireworks' },
    { time: '02:02', label: 'Walima Portraits & Credits' },
  ],
};

export const TRUSTED_PARTNERS: TrustedPartner[] = [
  {
    id: 'modern-cash-carry',
    name: 'Modern Cash & Carry',
    sector: 'Retail & Commercial Launch',
    location: 'Hasilpur',
    scope: 'Commercial Video · Aerial Drone · Social Reels',
    metric: '500K+ Campaign Views',
    summary: 'Complete store launch film, aerial exterior coverage, and vertical product reels produced for Hasilpur flagship retail.',
  },
  {
    id: 'royal-marquee-hasilpur',
    name: 'Royal Palm Marquee',
    sector: 'Hospitality & Wedding Venue',
    location: 'Hasilpur',
    scope: 'Venue Showcase · Event Lighting Film',
    metric: '45+ Joint Events',
    summary: 'Architectural twilight drone showcases and preferred wedding coverage across seasonal bridal bookings.',
  },
  {
    id: 'al-noor-jewellers',
    name: 'Al-Noor Bridal Jewellers',
    sector: 'Bridal Couture & Jewellery',
    location: 'Bahawalpur',
    scope: 'Macro Product Film · Bridal Campaign',
    metric: '12 Seasonal Lookbooks',
    summary: 'Studio macro photography and editorial bridal lookbooks highlighting traditional kundan and zardozi craftsmanship.',
  },
  {
    id: 'muzbeauty-cosmetics',
    name: 'MuzBeauty Studio Line',
    sector: 'Bridal Skincare Launch',
    location: 'Punjab',
    scope: 'Product Photography · Launch Teasers',
    metric: '2026 Campaign Partner',
    summary: 'Studio lighting campaign photography and pre-launch visual identity assets for bridal glow skincare.',
  },
];

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: 'rev-hamza-ayesha',
    clientName: 'Hamza & Ayesha',
    eventType: '2-Day Mehndi & Barat',
    location: 'Hasilpur',
    date: 'October 2026',
    packageUsed: 'Signature Package (Male + Female Crew)',
    quote: 'Having a dedicated female photographer made our bridal and family portraits completely comfortable. We received our edited album and 4K highlights right on schedule through the client portal.',
    outcome: '680 edited photos + 4K film delivered in 14 days',
  },
  {
    id: 'rev-usman-hira',
    clientName: 'Usman & Hira',
    eventType: 'Barat & Walima Coverage',
    location: 'Bahawalpur',
    date: 'September 2026',
    packageUsed: 'Premium Multi-Cam Package',
    quote: 'The drone twilight shots over the marquee and gimbal tracking during our Walima entrance looked like a cinema production. Zero confusion on pricing or deliverables.',
    outcome: '2 Indian albums + 2-day drone + full highlight reel',
  },
  {
    id: 'rev-modern-cash',
    clientName: 'Tariq Mehmood, Director',
    eventType: 'Commercial Grand Opening',
    location: 'Modern Cash & Carry, Hasilpur',
    date: 'August 2026',
    packageUsed: 'Re-Branding & Drone Campaign',
    quote: 'MuzFrame delivered sharp aerial footage and fast-turnaround reels within 48 hours of our store launch, helping drive footfall across Hasilpur and Chishtian.',
    outcome: '500K+ local views across Instagram & TikTok',
  },
];
