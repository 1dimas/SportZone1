// app/data/dummyProduct.ts
export const dummyProduct = {
  id: 1,
  name: 'Aerostride Flyknit Runner Pro-X',
  slug: 'aerostride-flyknit-runner-pro-x',
  category: 'Running',
  price: 2800000,
  discountPercentage: 15,
  rating: 4.8,
  reviewCount: 124,
  // Siapkan beberapa gambar untuk galeri
  images: [
    '/products/sepatu-1a.jpg',
    '/products/sepatu-1b.jpg',
    '/products/sepatu-1c.jpg',
    '/products/sepatu-1d.jpg',
  ],
  sizes: [40, 41, 42, 43, 44, 45],
  colors: [
    { name: 'Abyss Black', hex: '#000000' },
    { name: 'Glacier White', hex: '#FFFFFF' },
    { name: 'Ocean Blue', hex: '#3b82f6' },
  ],
  description: 'Sepatu lari revolusioner yang dirancang untuk kecepatan dan kenyamanan maksimal. Dengan teknologi Flyknit terbaru dan sol React Foam, setiap langkah terasa lebih ringan dan responsif. Cocok untuk lari jarak jauh maupun latihan harian.',
  specifications: { 
    'Bahan Atas': 'Flyknit Mesh', 
    'Teknologi Sol': 'React Foam', 
    'Berat': '250g (Ukuran 42)',
    'Tipe Ikatan': 'Tali Sepatu',
  }
};