// Definisikan tipe untuk Varian
export type ProductVariant = {
  size: string | number;
  stock: number;
};

// Definisikan tipe untuk Produk
export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
  description: string;
  variants: ProductVariant[];
};

const products: Product[] = [
  // --- Kategori Basket ---
  {
    id: 1,
    name: "FeatherLite Carbon X1",
    price: 2800000,
    category: "Basketball",
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    description: "Sepatu basket dengan material carbon ringan, cocok untuk pemain profesional.",
    variants: [
      { size: 42, stock: 10 },
      { size: 43, stock: 5 },
      { size: 44, stock: 8 },
    ],
  },
  {
    id: 2,
    name: "FeatherLite Carbon X2",
    category: "Basketball",
    price: 650000,
    imageUrl: "/products/kao.jpeg",
    description: "Sepatu basket dengan grip kuat dan desain modern.",
    variants: [
      { size: 40, stock: 20 },
      { size: 41, stock: 15 },
    ],
  },
  // --- Kategori Sepak Bola ---
  {
    id: 3,
    name: "FeatherLite Carbon X3",
    category: "Soccer",
    price: 999000,
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    description: "Sepatu bola ringan dengan sol anti slip, nyaman untuk semua kondisi lapangan.",
    variants: [
      { size: 41, stock: 12 },
      { size: 42, stock: 0 },
      { size: 43, stock: 18 },
    ],
  },
  // --- Kategori Badminton ---
  {
    id: 4,
    name: "FeatherLite Carbon X4",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    description: "Sepatu badminton dengan bantalan empuk untuk mengurangi benturan.",
    variants: [
      { size: 39, stock: 5 },
      { size: 40, stock: 10 },
      { size: 41, stock: 7 },
    ],
  },
  // --- Kategori Lari ---
  {
    id: 13,
    name: "AeroRun Swift Z1",
    price: 1750000,
    category: "Running",
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    description: "Sepatu lari ultra-ringan dengan teknologi Aero-cushion untuk lari jarak jauh.",
    variants: [
      { size: 42, stock: 11 },
      { size: 43, stock: 9 },
      { size: 44, stock: 0 },
    ],
  },
  // --- Kategori Lifestyle ---
  {
    id: 20,
    name: "UrbanWalk Classic",
    price: 750000,
    category: "Lifestyle",
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    description: "Sneakers kasual yang nyaman untuk dipakai sehari-hari.",
    variants: [
      { size: 40, stock: 30 },
      { size: 41, stock: 25 },
      { size: 42, stock: 22 },
    ],
  },
  {
    id: 26, // Contoh produk dengan ukuran S, M, L
    name: "SportZone Performance Tee",
    price: 350000,
    category: "Lifestyle",
    imageUrl: "/products/kao.jpeg",
    description: "Kaos olahraga dengan bahan dry-fit yang menyerap keringat.",
    variants: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 5 },
    ],
  },
  {
    id: 27, // Contoh produk tanpa ukuran spesifik
    name: "Pro-Grip Basketball",
    price: 450000,
    category: "Basketball",
    imageUrl: "/products/kao.jpeg",
    description: "Bola basket standar FIBA dengan grip yang optimal.",
    variants: [
      { size: "One Size", stock: 50 },
    ],
  },
  // ... (Sisa produk lainnya bisa kamu tambahkan variannya sendiri dengan pola yang sama)
];

export default products;