export type Category = {
  id: string;        // slug unik, contoh: "basket/sepatu"
  name: string;      // nama tampilan, contoh: "Sepatu Basket"
  parent?: string;   // kategori induk, contoh: "basket"
};

export const categories: Category[] = [
  // --- Basket ---
  { id: "basket", name: "Basket" },
  { id: "basket/sepatu", name: "Sepatu Basket", parent: "basket" },
  { id: "basket/bola", name: "Bola Basket", parent: "basket" },
  { id: "basket/jersey", name: "Jersey & Celana", parent: "basket" },

  // --- Badminton ---
  { id: "badminton", name: "Badminton" },
  { id: "badminton/raket", name: "Raket", parent: "badminton" },
  { id: "badminton/shuttlecock", name: "Shuttlecock", parent: "badminton" },
  { id: "badminton/sepatu", name: "Sepatu Badminton", parent: "badminton" },

  // --- Renang ---
  { id: "renang", name: "Renang" },
  { id: "renang/kacamata", name: "Kacamata Renang", parent: "renang" },
  { id: "renang/baju", name: "Baju Renang", parent: "renang" },
];
