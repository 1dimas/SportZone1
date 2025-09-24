// Definisikan tipe untuk Varian
export type ProductVariant = {
  size: string | number;
  stock: number;
};

// Definisikan tipe untuk Produk dengan tambahan subcategory
export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  subcategory: string; // Properti baru ditambahkan
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
    slug: "featherlite-carbon-x1",
    price: 2800000,
    category: "Basketball",
    subcategory: "Sepatu",
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
    slug: "featherlite-carbon-x2",
    category: "Basketball",
    subcategory: "Sepatu",
    price: 650000,
    imageUrl: "/products/kao.jpeg",
    description: "Sepatu basket dengan grip kuat dan desain modern.",
    variants: [
      { size: 40, stock: 20 },
      { size: 41, stock: 15 },
    ],
  },
  {
    id: 27,
    name: "Pro-Grip Basketball",
    slug: "pro-grip-basketball",
    price: 450000,
    category: "Basketball",
    subcategory: "Peralatan",
    imageUrl: "/products/kao.jpeg",
    description: "Bola basket standar FIBA dengan grip yang optimal.",
    variants: [{ size: "One Size", stock: 50 }],
  },

  // --- Kategori Sepak Bola ---
  {
    id: 3,
    name: "FeatherLite Carbon X3",
    slug: "featherlite-carbon-x3",
    category: "Soccer",
    subcategory: "Sepatu",
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
  {
    id: 5,
    name: "Pro League Soccer Ball",
    slug: "pro-league-soccer-ball",
    category: "Soccer",
    subcategory: "Peralatan",
    price: 550000,
    imageUrl: "/products/kao.jpeg",
    description: "Bola sepak standar FIFA dengan kontrol akurat.",
    variants: [{ size: "5", stock: 25 }],
  },

  // --- Kategori Badminton ---
  {
    id: 4,
    name: "FeatherLite Carbon X4",
    slug: "featherlite-carbon-x4",
    category: "Badminton",
    subcategory: "Sepatu",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    description: "Sepatu badminton dengan bantalan empuk untuk mengurangi benturan.",
    variants: [
      { size: 39, stock: 5 },
      { size: 40, stock: 10 },
      { size: 41, stock: 7 },
    ],
  },
  {
    id: 6,
    name: "Yonex Nanoflare 1000Z",
    slug: "yonex-nanoflare-1000z",
    category: "Badminton",
    subcategory: "Raket",
    price: 3200000,
    imageUrl: "/products/kao.jpeg",
    description: "Raket badminton premium dengan tenaga smash kuat.",
    variants: [
      { size: "3U", stock: 15 },
      { size: "4U", stock: 20 },
    ],
  },

  // --- Kategori Lari ---
  {
    id: 13,
    name: "AeroRun Swift Z1",
    slug: "aerorun-swift-z1",
    price: 1750000,
    category: "Running",
    subcategory: "Sepatu",
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    description: "Sepatu lari ultra-ringan dengan teknologi Aero-cushion untuk lari jarak jauh.",
    variants: [
      { size: 42, stock: 11 },
      { size: 43, stock: 9 },
      { size: 44, stock: 0 },
    ],
  },
  {
    id: 14,
    name: "HydroFlex Running Bottle",
    slug: "hydroflex-running-bottle",
    price: 250000,
    category: "Running",
    subcategory: "Aksesoris",
    imageUrl: "/products/kao.jpeg",
    description: "Botol minum ergonomis untuk pelari jarak menengah dan jauh.",
    variants: [{ size: "One Size", stock: 40 }],
  },

  // --- Kategori Renang ---
  {
    id: 7,
    name: "AquaVision Pro Goggles",
    slug: "aquavision-pro-goggles",
    category: "Swimming",
    subcategory: "Aksesoris",
    price: 350000,
    imageUrl: "/products/kao.jpeg",
    description: "Kacamata renang anti-fog dengan perlindungan UV.",
    variants: [{ size: "One Size", stock: 60 }],
  },
  {
    id: 8,
    name: "HydroFit Swimsuit",
    slug: "hydrofit-swimsuit",
    category: "Swimming",
    subcategory: "Pakaian",
    price: 500000,
    imageUrl: "/products/kao.jpeg",
    description: "Baju renang dengan bahan elastis premium untuk kenyamanan maksimal.",
    variants: [
      { size: "M", stock: 20 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 },
    ],
  },

  // --- Kategori Fitness & Gym ---
  {
    id: 9,
    name: "ProGym Dumbbell Set",
    slug: "progym-dumbbell-set",
    category: "Fitness",
    subcategory: "Peralatan",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    description: "Dumbbell adjustable 20kg untuk latihan kekuatan di rumah.",
    variants: [{ size: "20kg", stock: 12 }],
  },
  {
    id: 10,
    name: "Yoga Balance Mat",
    slug: "yoga-balance-mat",
    category: "Fitness",
    subcategory: "Peralatan",
    price: 400000,
    imageUrl: "/products/kao.jpeg",
    description: "Matras yoga anti slip dengan ketebalan 8mm.",
    variants: [{ size: "One Size", stock: 30 }],
  },

  // --- Kategori Sepeda ---
  {
    id: 11,
    name: "Cyclone Pro Helmet",
    slug: "cyclone-pro-helmet",
    category: "Cycling",
    subcategory: "Aksesoris",
    price: 850000,
    imageUrl: "/products/kao.jpeg",
    description: "Helm sepeda dengan ventilasi optimal dan sertifikasi internasional.",
    variants: [
      { size: "M", stock: 25 },
      { size: "L", stock: 15 },
    ],
  },
  {
    id: 12,
    name: "RoadMaster Cycling Jersey",
    slug: "roadmaster-cycling-jersey",
    category: "Cycling",
    subcategory: "Pakaian",
    price: 650000,
    imageUrl: "/products/kao.jpeg",
    description: "Jersey sepeda dengan teknologi quick-dry.",
    variants: [
      { size: "M", stock: 20 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 },
    ],
  },

  // --- Kategori Outdoor & Hiking ---
  {
    id: 15,
    name: "MountainX Trekking Pole",
    slug: "mountainx-trekking-pole",
    category: "Outdoor",
    subcategory: "Peralatan",
    price: 450000,
    imageUrl: "/products/kao.jpeg",
    description: "Trekking pole ringan berbahan aluminium alloy.",
    variants: [{ size: "One Size", stock: 30 }],
  },
  {
    id: 16,
    name: "AlpinePro Hiking Jacket",
    slug: "alpinepro-hiking-jacket",
    category: "Outdoor",
    subcategory: "Pakaian",
    price: 1350000,
    imageUrl: "/products/kao.jpeg",
    description: "Jaket gunung tahan angin dan air.",
    variants: [
      { size: "M", stock: 10 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 },
    ],
  },

  // --- Kategori Lifestyle ---
  {
    id: 20,
    name: "UrbanWalk Classic",
    slug: "urbanwalk-classic",
    price: 750000,
    category: "Lifestyle",
    subcategory: "Sepatu",
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
    id: 26,
    name: "SportZone Performance Tee",
    slug: "sportzone-performance-tee",
    price: 350000,
    category: "Lifestyle",
    subcategory: "Pakaian",
    imageUrl: "/products/kao.jpeg",
    description: "Kaos olahraga dengan bahan dry-fit yang menyerap keringat.",
    variants: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 5 },
    ],
  },
];

export default products;