// app/data/bannerData.ts

export type Banner = {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  href: string;
};

export const bannerData: Banner[] = [
  {
    id: 1,
    imageUrl: '/banners/akane2.jpg', // Pastikan gambar ada di /public/banners/
    title: 'Koleksi Lari Terbaru',
    subtitle: 'Taklukkan setiap kilometer dengan teknologi terdepan.',
    href: '/sports/lari'
  },
  {
    id: 2,
    imageUrl: '/banners/YU ZHONG.jpeg',
    title: 'Gear Badminton Profesional',
    subtitle: 'Smash lebih kuat, bergerak lebih lincah.',
    href: '/sports/badminton'
  },
  {
    id: 3,
    imageUrl: '/banners/yss.jpeg',
    title: 'Dominasi Lapangan Futsal',
    subtitle: 'Kontrol, kecepatan, dan presisi dalam satu paket.',
    href: '/sepatu/futsal'
  }
];