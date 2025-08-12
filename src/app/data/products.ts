// 1. Definisikan struktur atau "tipe" untuk satu objek produk
export type Product = {
  id: number;
  name: string;
  category?: string;
  price: number;
  oldPrice?: number; // Tanda '?' berarti properti ini tidak wajib ada (opsional)
  imageUrl: string;
  isNew?: boolean; // Properti ini juga opsional
};

// 2. Terapkan tipe tersebut ke array data kita
// Product[] berarti "sebuah array yang isinya adalah objek Product"
const products: Product[] = [
  {
    id: 1,
    name: "Aerostride Flyknit Runner",
    category: "Running",
    price: 2800000,
    oldPrice: 3500000,
    imageUrl: "/images/sepatu-lari.jpg",
    isNew: true,
  },
  {
    id: 2,
    name: "Spalding Pro-Court Master",
    category: "Basketball",
    price: 650000,
    imageUrl: "/images/bola-basket.jpg",
  },
  {
    id: 3,
    name: "Garuda Pride Home Kit 2025",
    category: "Soccer",
    price: 999000,
    imageUrl: "/images/jersey-timnas.jpg",
    isNew: true,
  },
  {
    id: 4,
    name: "FeatherLite Carbon X1",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/images/raket-badminton.jpg",
  },
];

export default products;