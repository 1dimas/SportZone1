export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
  stock: number;
  sold: number;
  description: string;
};



const products: Product[] = [
  {
    id: 1,
    name: "FeatherLite Carbon X1",
    price: 2800000,
    category: "Basketball",
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    stock: 15,
    sold: 120,
    description: "Sepatu basket dengan material carbon ringan, cocok untuk pemain profesional.",
  },
  {
    id: 2,
    name: "FeatherLite Carbon X2",
    category: "Basketball",
    price: 650000,
    imageUrl: "/products/kao.jpeg",
    stock: 40,
    sold: 320,
    description: "Sepatu basket dengan grip kuat dan desain modern.",
  },
  {
    id: 3,
    name: "FeatherLite Carbon X3",
    category: "Soccer",
    price: 999000,
    imageUrl: "/products/kao.jpeg",
    isNew: true,
    stock: 25,
    sold: 210,
    description: "Sepatu bola ringan dengan sol anti slip, nyaman untuk semua kondisi lapangan.",
  },
  {
    id: 4,
    name: "FeatherLite Carbon X4",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 10,
    sold: 150,
    description: "Sepatu badminton dengan bantalan empuk untuk mengurangi benturan.",
  },
  {
    id: 5,
    name: "FeatherLite Carbon X5",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 30,
    sold: 90,
    description: "Sepatu serbaguna untuk pemain pemula maupun profesional.",
  },
  {
    id: 6,
    name: "FeatherLite Carbon X6",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 18,
    sold: 60,
    description: "Sepatu badminton dengan desain ringan dan breathable.",
  },
  {
    id: 7,
    name: "FeatherLite Carbon X7",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 12,
    sold: 110,
    description: "Sepatu premium dengan daya tahan tinggi untuk latihan intensif.",
  },
  {
    id: 8,
    name: "FeatherLite Carbon X8",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 22,
    sold: 95,
    description: "Sepatu badminton dengan support ankle ekstra.",
  },
  {
    id: 9,
    name: "FeatherLite Carbon X9",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 8,
    sold: 140,
    description: "Sepatu ringan dengan fleksibilitas tinggi.",
  },
  {
    id: 10,
    name: "FeatherLite Carbon X10",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 35,
    sold: 170,
    description: "Sepatu dengan desain modern dan performa optimal.",
  },
  {
    id: 11,
    name: "FeatherLite Carbon X11",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 20,
    sold: 75,
    description: "Sepatu dengan grip kuat dan nyaman dipakai lama.",
  },
  {
    id: 12,
    name: "FeatherLite Carbon X12",
    category: "Badminton",
    price: 1200000,
    imageUrl: "/products/kao.jpeg",
    stock: 28,
    sold: 60,
    description: "Sepatu all-rounder untuk latihan maupun turnamen.",
  },
];

export default products;
