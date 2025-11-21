// services/menu.service.ts
import { getAllKategoriOlahraga } from "./olahraga.service";
import { getAllSubkategoriPeralatan } from "./subkategori-peralatan.service";
import { MenuItem, MenuColumn, LinkItem } from "@/app/data/menuData";

export async function getMenuData(): Promise<MenuItem[]> {
  try {
    // Ambil kategori dan subkategori secara paralel
    const [kategoriOlahraga, subkategoriPeralatan] = await Promise.all([
      getAllKategoriOlahraga(),
      getAllSubkategoriPeralatan(),
    ]);

    // Pastikan kita bekerja dengan array
    const categories = Array.isArray(kategoriOlahraga) ? kategoriOlahraga : [kategoriOlahraga];
    const subcategories = Array.isArray(subkategoriPeralatan) ? subkategoriPeralatan : [subkategoriPeralatan];

    // Buat map untuk memudahkan pencarian subkategori berdasarkan ID induknya
    const subcategoryMap = new Map<string, LinkItem[]>();
    for (const sub of subcategories) {
      if (!sub.kategori_olahraga_id) continue;
      
      const parentId = sub.kategori_olahraga_id;
      if (!subcategoryMap.has(parentId)) {
        subcategoryMap.set(parentId, []);
      }
      
      const link: LinkItem = {
        name: sub.nama,
        // Asumsikan struktur URL berdasarkan nama induk dan subkategori
        href: `/sports/${sub.kategoriOlahraga.nama.toLowerCase()}/${sub.nama.toLowerCase().replace(/\s+/g, '-')}`,
      };
      subcategoryMap.get(parentId)!.push(link);
    }
    
    // Bangun struktur menu akhir
    const columns: MenuColumn[] = categories.map((cat) => ({
      heading: cat.nama.toUpperCase(),
      links: subcategoryMap.get(cat.id) || [],
    }));
    
    const menu: MenuItem[] = [
      {
        title: 'SPORTS',
        href: '/sports',
        slug: 'sports',
        columns: columns,
      },
    ];

    return menu;

  } catch (error) {
    console.error("Gagal mengambil atau memproses data menu:", error);
    // Kembalikan struktur default/kosong jika terjadi error
    return [
      {
        title: 'SPORTS',
        href: '/sports',
        slug: 'sports',
        columns: [],
      },
    ];
  }
}