export const STUDIO_CONTACT = {
  brandName: 'MuzFrame Studio',
  tagline: 'Wedding Photography & Cinema · Hasilpur',
  officialPhoneDisplay: '+92 300 6103262',
  officialPhoneTel: '+923006103262',
  officialWhatsAppNumber: '923006103262',
  officialEmail: 'muzammal.khan99@gmail.com',
  address: 'Office No. 32, Old Kachheri, Hasilpur, 63000, Pakistan',
  city: 'Hasilpur, Punjab, Pakistan',
  hours: 'Mon – Sun · 10:00 AM – 9:00 PM',
  socials: {
    instagram: 'https://instagram.com/muzframe',
    instagramHandle: '@muzframe',
    tiktok: 'https://tiktok.com/@muzframe',
    tiktokHandle: '@muzframe',
    youtube: 'https://youtube.com/@muzframestudio',
    youtubeHandle: '@muzframestudio',
  },
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${STUDIO_CONTACT.officialWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
