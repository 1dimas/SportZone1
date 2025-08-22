export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  avatarUrl: string;
  rating: number;
}

export const testimonialData: Testimonial[] = [
  {
    id: 1,
    quote: "Pengirimannya super cepat! Pesan kemarin, hari ini sudah sampai. Kualitas produknya juga original, sangat memuaskan.",
    name: "Ajla Aramdi",
    title: "Software Engineer, Jakarta",
    avatarUrl: "/images/avatar/ajla.jpeg",// Ganti dengan path gambar avatarmu
    rating: 5,
  },
  {
    id: 2,
    quote: "Adminnya responsif dan sangat membantu saat saya bingung memilih ukuran. Proses pengembalian barangnya juga mudah. Recommended seller!",
    name: "Fakhri Apalah",
    title: "Graphic Designer, Bandung",
    avatarUrl: "/images/avatar/pahri.jpeg", // Ganti dengan path gambar avatarmu
    rating: 5,
  },
  {
    id: 3,
    quote: "Sudah beberapa kali belanja di sini dan tidak pernah kecewa. Pilihan barangnya banyak dan sering ada promo menarik.",
    name: "Jayjo",
    title: "Wirausaha, Surabaya",
    avatarUrl: "/images/avatar/jojo.jpeg", // Ganti dengan path gambar avatarmu
    rating: 4.5,
  },
];