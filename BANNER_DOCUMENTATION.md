# Banner Promosi E-commerce - Dokumentasi

## Overview
Fitur banner promosi untuk menampilkan promosi di homepage dengan kemampuan CRUD (Create, Read, Update, Delete) di admin dashboard.

## Fitur yang Sudah Dibuat

### 1. Backend API Integration
**File:** `src/components/lib/services/banner.service.ts`

Fungsi yang tersedia:
- `getActiveBanners()` - Mendapatkan banner aktif untuk homepage (public)
- `getAllBanners(token)` - Mendapatkan semua banner (admin only)
- `getBannerById(id)` - Mendapatkan detail banner
- `createBanner(data, token)` - Membuat banner baru dengan upload gambar
- `updateBanner(id, data, token)` - Update banner existing
- `deleteBanner(id, token)` - Hapus banner

### 2. Frontend - Homepage Banner Carousel
**File:** `src/components/Home/BannerCarousel.tsx`

Fitur:
- Auto-slide carousel menggunakan Swiper
- Navigation arrows
- Pagination dots
- Fade effect transition
- Loading skeleton
- Klik banner redirect ke:
  - **Product**: `/product/{productId}` - Detail produk
  - **Brand**: `/products/brand/{brandId}` - Semua produk dari brand
  - **Category**: `/sports/{categoryName}` - Semua produk dari kategori olahraga

### 3. Halaman Produk by Brand
**File:** `src/app/products/brand/[brandId]/page.tsx`

Fitur:
- Menampilkan semua produk dari brand tertentu
- Logo dan deskripsi brand
- Product grid dengan rating
- Filter dan sorting (dapat dikembangkan)

### 4. Admin Dashboard - Banner Management

#### a. List Banner (`/dashboardadmin/banner`)
**Files:**
- `src/app/dashboardadmin/banner/page.tsx`
- `src/components/admin/banner-table.tsx`
- `src/components/admin/banner-table-wrapper.tsx`

Fitur:
- Table list semua banner
- Filter by title
- Pagination
- Preview image
- Status badge (Active/Inactive)
- Link type badge (Product/Brand/Category)
- Actions: Edit & Delete

#### b. Create Banner (`/dashboardadmin/banner/create`)
**File:** `src/app/dashboardadmin/banner/create/page.tsx`

#### c. Edit Banner (`/dashboardadmin/banner/[id]/edit`)
**File:** `src/app/dashboardadmin/banner/[id]/edit/page.tsx`

#### d. Banner Form
**File:** `src/components/admin/banner-form.tsx`

Fitur form:
- **Title** (optional) - Judul banner yang ditampilkan di overlay
- **Image Upload** - Upload gambar banner dengan preview (recommended: 1920x500px)
- **Link Type** - Dropdown selector:
  - Product
  - Brand
  - Category
- **Link Value** - Input dengan helper dropdown:
  - Untuk Brand: Dropdown list brand yang tersedia
  - Untuk Category: Dropdown list kategori olahraga
  - Untuk Product: Input manual product ID
- **Active Status** - Checkbox untuk mengaktifkan/nonaktifkan banner
- **Start Date** (optional) - Tanggal mulai banner ditampilkan
- **End Date** (optional) - Tanggal berakhir banner

### 5. Admin Sidebar Menu
**File:** `src/components/admin/app-sidebar.tsx`

Menu "Banner" sudah ditambahkan di sidebar admin antara Brand dan Products.

## Cara Menggunakan

### Untuk Admin - Membuat Banner Baru

1. Login sebagai admin
2. Masuk ke Dashboard Admin → Banner
3. Klik tombol "Add Banner"
4. Isi form:
   - Upload gambar banner (recommended 1920x500px)
   - Masukkan title (optional)
   - Pilih Link Type:
     - **Product**: Masukkan ID produk (copy dari URL detail produk)
     - **Brand**: Klik "Show Brands" dan pilih brand dari list
     - **Category**: Klik "Show Categories" dan pilih kategori olahraga
   - Set Active/Inactive
   - Set tanggal mulai dan berakhir (optional)
5. Klik "Create Banner"

### Untuk Admin - Edit Banner

1. Di halaman Banner list, klik icon titik tiga pada banner yang ingin diedit
2. Pilih "Edit"
3. Update informasi yang diperlukan
4. Klik "Update Banner"

### Untuk Admin - Delete Banner

1. Di halaman Banner list, klik icon titik tiga pada banner yang ingin dihapus
2. Pilih "Delete"
3. Konfirmasi penghapusan

## Contoh Link Value

### Product
```
link_type: "product"
link_value: "550e8400-e29b-41d4-a716-446655440000"
```
Akan redirect ke: `/product/550e8400-e29b-41d4-a716-446655440000`

### Brand
```
link_type: "brand"
link_value: "660e8400-e29b-41d4-a716-446655440001"
```
Akan redirect ke: `/products/brand/660e8400-e29b-41d4-a716-446655440001`

### Category
```
link_type: "category"
link_value: "Futsal"
```
Akan redirect ke: `/sports/Futsal`

## Technical Details

### Banner Entity (Backend)
```typescript
{
  id: string;
  title: string | null;
  image_url: string | null;
  link_type: "product" | "brand" | "category";
  link_value: string;
  is_active: boolean;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
```

### API Endpoints
- `GET /banners` - Public: List banner aktif
- `GET /banners/all` - Admin: List semua banner
- `GET /banners/:id` - Public: Detail banner
- `POST /banners` - Admin: Create banner (with image upload)
- `PATCH /banners/:id` - Admin: Update banner
- `DELETE /banners/:id` - Admin: Delete banner

## Dependencies
- Swiper.js - Untuk carousel
- Next.js Image - Untuk optimisasi gambar
- React Hook Form - Form handling
- Sonner - Toast notifications
- Tailwind CSS - Styling

## File Structure
```
src/
├── components/
│   ├── lib/
│   │   └── services/
│   │       └── banner.service.ts
│   ├── Home/
│   │   ├── BannerCarousel.tsx
│   │   └── BannerCarouselSkeleton.tsx
│   └── admin/
│       ├── banner-form.tsx
│       ├── banner-table.tsx
│       ├── banner-table-wrapper.tsx
│       └── app-sidebar.tsx
├── app/
│   ├── home/
│   │   └── page.tsx (integrated banner)
│   ├── products/
│   │   └── brand/
│   │       └── [brandId]/
│   │           └── page.tsx
│   └── dashboardadmin/
│       └── banner/
│           ├── page.tsx
│           ├── create/
│           │   └── page.tsx
│           └── [id]/
│               └── edit/
│                   └── page.tsx
```

## Notes
- Banner hanya ditampilkan jika `is_active = true`
- Banner dengan `start_date` di masa depan tidak akan ditampilkan
- Banner dengan `end_date` yang sudah lewat tidak akan ditampilkan
- Backend otomatis check dan disable banner yang expired
- Gambar banner di-upload ke `./uploads/banner/` di backend
- Recommended image size: 1920x500px untuk optimal display
