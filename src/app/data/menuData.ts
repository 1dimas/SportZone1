// app/data/menuData.ts

// Definisikan tipe data untuk keamanan tipe
export type LinkItem = {
  name: string;
  href: string;
};

export type MenuColumn = {
  heading: string;
  links: LinkItem[];
};

export type MenuItem = {
  title: string;
  href: string;
  columns: MenuColumn[];
  slug?: string; // tambahkan property slug (opsional)
};

// Data hanya berisi satu item utama: SPORTS
export const menuData: MenuItem[] = [
  {
    title: 'SPORTS', // Hanya item ini yang ada di level atas
    href: '/sports',
    slug: 'sports', // tambahkan slug pada item utama
    columns: [
      {
        heading: 'BADMINTON',
        links: [
          { name: 'Raket', href: '/sports/badminton/raket' },
          { name: 'Shuttlecock', href: '/sports/badminton/shuttlecock' },
          { name: 'Sepatu Badminton', href: '/sports/badminton/sepatu' },
          { name: 'Tas Raket', href: '/sports/badminton/tas' },
          { name: 'Senar & Grip', href: '/sports/badminton/aksesoris' },
        ],
      },
      {
        heading: 'RENANG',
        links: [
          { name: 'Kacamata Renang', href: '/sports/renang/kacamata' },
          { name: 'Baju Renang', href: '/sports/renang/baju' },
          { name: 'Papan Seluncur', href: '/sports/renang/papan' },
          { name: 'Kaki Katak (Fins)', href: '/sports/renang/fins' },
          { name: 'Topi Renang', href: '/sports/renang/topi' },
        ],
      },
      {
        heading: 'BASKET',
        links: [
            { name: 'Bola Basket', href: '/sports/basket/bola' },
            { name: 'Jersey & Celana', href: '/sports/basket/jersey' },
            { name: 'Papan & Ring', href: '/sports/basket/ring' },
            { name: 'Aksesoris', href: '/sports/basket/aksesoris' },
        ]
      },
      {
        heading: 'LARI',
        links: [
            { name: 'Pakaian Lari', href: '/sports/lari/pakaian' },
            { name: 'Smartwatch & GPS', href: '/sports/lari/watch' },
            { name: 'Botol Minum & Tas Pinggang', href: '/sports/lari/aksesoris' },
        ]
      },
      {
        heading: 'FITNESS & GYM',
        links: [
            { name: 'Pakaian Gym', href: '/sports/gym/pakaian' },
            { name: 'Sepatu Training', href: '/sports/gym/sepatu' },
            { name: 'Matras Yoga', href: '/sports/gym/matras' },
            { name: 'Dumbbell & Barbell', href: '/sports/gym/beban' },
            { name: 'Resistance Band', href: '/sports/gym/band' },
        ]
      },
      {
        heading: 'BERSEPEDA',
        links: [
            { name: 'Helm Sepeda', href: '/sports/sepeda/helm' },
            { name: 'Jersey & Celana Sepeda', href: '/sports/sepeda/jersey' },
            { name: 'Sarung Tangan & Kacamata', href: '/sports/sepeda/aksesoris' },
            { name: 'Lampu & Bel', href: '/sports/sepeda/safety' },
        ]
      },
      {
        heading: 'OUTDOOR & HIKING',
        links: [
            { name: 'Tas Carrier & Daypack', href: '/sports/outdoor/tas' },
            { name: 'Tenda & Sleeping Bag', href: '/sports/outdoor/camping' },
            { name: 'Jaket Gunung', href: '/sports/outdoor/jaket' },
            { name: 'Trekking Pole', href: '/sports/outdoor/pole' },
        ]
      }
    ],
  },
];