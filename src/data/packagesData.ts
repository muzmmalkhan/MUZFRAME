export interface PackageItem {
  id: string;
  category: 'wedding' | 'bridal';
  code: string;
  name: string;
  price: string;
  priceNum: number;
  coverage: string;
  days: number;
  badge?: string;
  isPopular?: boolean;
  bestFor: string;
  // Key highlights for instant scanning
  crewSummary: string;
  droneSummary: string;
  albumSummary: string;
  femalePhotoSummary?: string;
  includes: string[];
}

export const ALL_PACKAGES: PackageItem[] = [
  // WEDDING PACKAGES (01 - 06)
  {
    id: 'package-01-basic',
    category: 'wedding',
    code: 'PACKAGE 01',
    name: 'Basic',
    price: 'Rs. 45,000/-',
    priceNum: 45000,
    coverage: '1 Day / 1 Event',
    days: 1,
    bestFor: 'Small Wedding / Engagement / Single Event',
    crewSummary: '1 Photographer & Videographer (DSLR)',
    droneSummary: '1 Day Drone Coverage',
    albumSummary: 'Digital Delivery (Album Optional)',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      '1 Professional DSLR Camera',
      'Photo + Video Coverage',
      '1 Photographer/Videographer',
      '1 Day Drone Coverage',
      'Candid Photography',
      'Professionally Edited Photos',
      'Edited Event Video',
      'Digital Delivery'
    ]
  },
  {
    id: 'package-02-essential',
    category: 'wedding',
    code: 'PACKAGE 02',
    name: 'Essential',
    price: 'Rs. 60,000/-',
    priceNum: 60000,
    coverage: '1 Day / 1 Event',
    days: 1,
    bestFor: 'Barat / Walima / Single-Day Wedding',
    crewSummary: '1 Videographer (Gimbal) + 1 Photographer',
    droneSummary: '1 Day Drone Coverage',
    albumSummary: 'Digital Delivery (Album Optional)',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      '1 Professional Videographer',
      'Gimbal Video Coverage',
      '1 Professional Photographer',
      'Professional Photography',
      '1 Day Drone Coverage',
      'Candid Photography',
      'Full Event Video',
      'Professionally Edited Photos',
      'Professionally Edited Video',
      'Digital Delivery'
    ]
  },
  {
    id: 'package-03-cinematic',
    category: 'wedding',
    code: 'PACKAGE 03',
    name: 'Cinematic',
    price: 'Rs. 90,000/-',
    priceNum: 90000,
    coverage: '2 Days / 2 Events',
    days: 2,
    bestFor: 'Couples wanting premium photography & cinematic video',
    crewSummary: '1 Videographer (Gimbal) + 2 Mirrorless Photographers',
    droneSummary: '2 Days Drone Coverage',
    albumSummary: 'Digital Delivery (Album Optional)',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      '1 Professional Videographer',
      'Gimbal Video Coverage',
      '2 Professional Mirrorless Photographers',
      'Wide-Angle Photography',
      '2 Days Drone Coverage',
      'Candid Photography',
      'Couple Portraits',
      'Family & Group Photos',
      'Full Event Videography',
      'Cinematic Video',
      'Professionally Edited Photos'
    ]
  },
  {
    id: 'package-04-signature',
    category: 'wedding',
    code: 'PACKAGE 04',
    name: 'Signature',
    price: 'Rs. 99,000/-',
    priceNum: 99000,
    coverage: '2 Days / 2 Events',
    days: 2,
    badge: '⭐ MOST POPULAR',
    isPopular: true,
    bestFor: 'Complete wedding coverage with Male + Female Photography',
    crewSummary: '1 Videographer + 1 Photographer + 1 Female Photographer',
    droneSummary: '2 Days Drone Coverage',
    albumSummary: '1 Premium Indian Album Included',
    femalePhotoSummary: '1 Female Photographer Included',
    includes: [
      '1 Professional Videographer',
      '1 Professional Photographer',
      '1 Female Photographer Included',
      '2 Days Drone Coverage',
      'Full Photo + Video Coverage',
      'Candid Photography',
      'Couple Portrait Session',
      'Family & Group Photography',
      'Cinematic Event Video',
      'Professionally Edited Photos',
      '1 Premium Indian Album Included',
      'Digital Delivery'
    ]
  },
  {
    id: 'package-05-premium',
    category: 'wedding',
    code: 'PACKAGE 05',
    name: 'Premium',
    price: 'Rs. 165,000/-',
    priceNum: 165000,
    coverage: '2 Days / 2 Events',
    days: 2,
    badge: '👑 ROYAL MULTI-CAM',
    bestFor: 'Large Weddings & Premium Multi-Camera Coverage',
    crewSummary: '1 Videographer + 2 Photographers + 2 Female Photographers (5 Crew)',
    droneSummary: '2 Days Drone Coverage',
    albumSummary: '2 Premium Indian Albums Included',
    femalePhotoSummary: '2 Female Photographers Included',
    includes: [
      '1 Professional Videographer',
      '2 Professional Photographers',
      'Mirrorless + DSLR Cameras',
      '2 Female Photographers Included',
      '2 Days Drone Coverage',
      'Multi-Camera Coverage',
      'Candid Photography',
      'Couple Portraits',
      'Family & Group Photography',
      'Full Event Videography',
      'Cinematic Wedding Film',
      '2 Premium Indian Albums Included',
      'Professionally Edited Photos',
      'Digital Delivery'
    ]
  },
  {
    id: 'package-06-reels-social',
    category: 'wedding',
    code: 'PACKAGE 06',
    name: 'Reels & Social',
    price: 'Rs. 200,000/-',
    priceNum: 200000,
    coverage: '2 Days / 2 Events',
    days: 2,
    badge: '🔥 ULTIMATE CONTENT',
    bestFor: 'Couples who want premium wedding coverage + viral social media content',
    crewSummary: '2 Videographers + 2 Photographers + 2 Female Photographers (6 Crew)',
    droneSummary: '2 Days Drone Coverage',
    albumSummary: 'Digital Delivery + Cinematic Film',
    femalePhotoSummary: '2 Female Photographers Included',
    includes: [
      '2 Professional Videographers',
      '2 Professional Photographers',
      '2 Female Photographers Included',
      '2 Days Drone Coverage',
      'Dedicated Reels Coverage (TikTok/Insta)',
      'Short-Form Wedding Videos',
      'Cinematic Video Coverage',
      'Candid Photography',
      'Couple Portraits',
      'Family & Group Coverage',
      'Professional Photo Editing',
      'Cinematic Wedding Film',
      'Digital Delivery'
    ]
  },

  // BRIDAL SPECIAL PACKAGES
  {
    id: 'bridal-classic',
    category: 'bridal',
    code: 'BRIDAL 01',
    name: 'Bridal Classic',
    price: 'Rs. 25,000/-',
    priceNum: 25000,
    coverage: '1 Day / Bridal Event',
    days: 1,
    bestFor: 'Solo Bridal Event / Getting Ready & Details',
    crewSummary: '1 DSLR Photographer + Videographer',
    droneSummary: 'Available as add-on',
    albumSummary: 'Digital Delivery',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      'Professional DSLR Photography',
      'Professional Video Coverage',
      'Bridal Portraits',
      'Getting Ready Coverage',
      'Bridal Details',
      'Edited Photos',
      'Edited Bridal Video'
    ]
  },
  {
    id: 'bridal-mirrorless',
    category: 'bridal',
    code: 'BRIDAL 02',
    name: 'Bridal Mirrorless',
    price: 'Rs. 35,000/-',
    priceNum: 35000,
    coverage: '1 Day / Bridal Event',
    days: 1,
    bestFor: 'Crisp Mirrorless 4K Bridal Shoot',
    crewSummary: '1 Mirrorless Camera Specialist (Photo + Video)',
    droneSummary: 'Available as add-on',
    albumSummary: 'Digital Delivery',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      'Professional Mirrorless Camera',
      'Photography + Videography',
      'Bridal Portrait Session',
      'Getting Ready Coverage',
      'Candid Bridal Moments',
      'Professional Photo Editing',
      'Edited Bridal Video'
    ]
  },
  {
    id: 'bridal-cinematic',
    category: 'bridal',
    code: 'BRIDAL 03',
    name: 'Bridal Cinematic',
    price: 'Rs. 50,000/-',
    priceNum: 50000,
    coverage: '1 Day / Bridal Event',
    days: 1,
    bestFor: 'Cinematic Bridal Film with Drone Entry',
    crewSummary: 'Mirrorless Photography + Videography + Drone Pilot',
    droneSummary: '1 Day Drone Included',
    albumSummary: 'Digital Delivery',
    femalePhotoSummary: 'Optional Add-on',
    includes: [
      'Professional Mirrorless Camera',
      'Professional Photography',
      'Professional Videography',
      '1 Day Drone Coverage Included',
      'Bridal Portrait Session',
      'Getting Ready Coverage',
      'Candid Photography',
      'Cinematic Video',
      'Professionally Edited Photos'
    ]
  },
  {
    id: 'bridal-premium',
    category: 'bridal',
    code: 'BRIDAL 04',
    name: 'Bridal Premium',
    price: 'Rs. 70,000/-',
    priceNum: 70000,
    coverage: '1 Day / Bridal Event',
    days: 1,
    badge: '⭐ COMPLETE BRIDAL PACKAGE',
    isPopular: true,
    bestFor: 'Full Bridal Coverage with Female Photographer & Album',
    crewSummary: '1 Videographer + 1 Photographer + 1 Female Photographer',
    droneSummary: '1 Day Drone Included',
    albumSummary: '1 Premium Indian Album Included',
    femalePhotoSummary: '1 Female Photographer Included',
    includes: [
      '1 Professional Videographer',
      '1 Professional Photographer',
      '1 Female Photographer Included',
      '1 Day Drone Coverage Included',
      '1 Premium Indian Album Included',
      'Full Bridal Photography',
      'Cinematic Video Coverage',
      'Bridal Portrait Session',
      'Getting Ready Coverage',
      'Candid Photography',
      'Professionally Edited Photos',
      'Professionally Edited Video'
    ]
  }
];
