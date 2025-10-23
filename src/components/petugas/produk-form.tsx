"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProduk,
  updateProduk,
  deleteGambarProduk,
} from "@/components/lib/services/produk.service";
import {
  getAllSubkategoriPeralatan,
  getSubkategoriPeralatanByKategoriOlahraga,
} from "@/components/lib/services/subkategori-peralatan.service";
import { getAllBrands } from "@/components/lib/services/brand.service";
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service";
import { triggerProductRefresh } from "@/components/lib/utils/product-refresh";

const produkSchema = z.object({
  nama: z.string().min(1, "Nama produk wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  harga: z.number().min(0, "Harga harus positif"),
  stok: z.number().min(0, "Stok minimal 0"),
  kategori_id: z.string().min(1, "Kategori wajib dipilih"),
  subkategori_id: z.string().min(1, "Subkategori wajib dipilih"),
  brand_id: z.string().min(1, "Brand wajib dipilih"),
  status: z.enum(["aktif", "nonaktif", "stok habis"]),
  gambar: z.array(z.instanceof(File)).optional(),
});

type ProdukFormData = z.infer<typeof produkSchema>;

interface ProdukFormProps {
  produk?: {
    id: string;
    nama: string;
    deskripsi: string;
    harga: number;
    stok?: number;
    subkategori_id: string;
    brand_id: string;
    status: string;
    gambar?: string[];
    subkategori?: {
      kategoriOlahraga?: {
        id: string;
      };
    };
  };
  onSuccess: () => void;
}

export function ProdukForm({ produk, onSuccess }: ProdukFormProps) {
  const [kategoriOlahragas, setKategoriOlahragas] = React.useState([]);
  const [subkategoris, setSubkategoris] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [deletedImages, setDeletedImages] = React.useState<string[]>([]); // Track deleted existing images
  const [hargaDisplay, setHargaDisplay] = React.useState<string>("");
  const [stokDisplay, setStokDisplay] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Format number to rupiah display
  const formatRupiah = (value: number): string => {
    return value.toLocaleString("id-ID");
  };

  // Parse rupiah string to number
  const parseRupiah = (value: string): number => {
    const cleaned = value.replace(/\D/g, ""); // Remove all non-digits
    return cleaned === "" ? 0 : parseInt(cleaned, 10);
  };

  const form = useForm<ProdukFormData>({
    resolver: zodResolver(produkSchema),
    defaultValues: {
      nama: produk?.nama || "",
      deskripsi: produk?.deskripsi || "",
      harga: produk?.harga || 0,
      stok: produk?.stok || 0,
      kategori_id: produk?.subkategori?.kategoriOlahraga?.id || "",
      subkategori_id: produk?.subkategori_id || "",
      brand_id: produk?.brand_id || "",
      status:
        (produk?.status as "aktif" | "nonaktif" | "stok habis") || "aktif",
      gambar: [],
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [kategoriData, subkategoriData, brandData] = await Promise.all([
          getAllKategoriOlahraga(),
          getAllSubkategoriPeralatan(),
          getAllBrands(),
        ]);
        setKategoriOlahragas(kategoriData);
        setSubkategoris(subkategoriData);
        setBrands(brandData);
      } catch (error) {
        toast.error("Gagal memuat data kategori, subkategori dan brand");
      }
    };
    fetchData();
  }, []);

  // Initialize harga and stok display
  React.useEffect(() => {
    if (produk?.harga) {
      setHargaDisplay(formatRupiah(produk.harga));
    }
    if (produk?.stok) {
      setStokDisplay(produk.stok.toString());
    }
  }, [produk]);

  // Reset form when produk changes (for edit)
  React.useEffect(() => {
    if (produk) {
      form.reset({
        nama: produk.nama || "",
        deskripsi: produk.deskripsi || "",
        harga: produk.harga || 0,
        stok: produk.stok || 0,
        kategori_id: produk.subkategori?.kategoriOlahraga?.id || "",
        subkategori_id: produk.subkategori_id || "",
        brand_id: produk.brand_id || "",
        status:
          (produk.status as "aktif" | "nonaktif" | "stok habis") || "aktif",
        gambar: [],
      });
      setDeletedImages([]); // Reset deleted images when editing a different product
    }
  }, [produk, form]);

  // Clean up preview URLs
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Initialize preview URLs for existing images when editing
  React.useEffect(() => {
    if (produk?.gambar) {
      // For existing images, we don't create object URLs, just use the image URLs directly
      // This is handled in the render section
    }
  }, [produk]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Add new files to existing selected files
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    form.setValue("gambar", updatedFiles);

    // Create preview URLs for new files
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeFile = async (
    index: number,
    isExistingImage: boolean = false,
    imageUrl?: string
  ) => {
    if (isExistingImage && imageUrl && produk) {
      // Delete from backend immediately
      try {
        await deleteGambarProduk(produk.id, imageUrl);
        // Add to deleted images list to hide from UI
        setDeletedImages((prev) => [...prev, imageUrl]);
        toast.success("Gambar berhasil dihapus");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Gagal menghapus gambar");
        return;
      }
    } else {
      // Remove from selected files
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
      form.setValue("gambar", newFiles);

      // Update preview URLs
      const newPreviewUrls = [...previewUrls];
      URL.revokeObjectURL(newPreviewUrls[index]);
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const clearAllFiles = () => {
    // Revoke all object URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    // Clear files and previews
    setSelectedFiles([]);
    setPreviewUrls([]);
    form.setValue("gambar", []);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProdukFormData) => {
    setLoading(true);
    try {
      if (produk) {
        // Update
        await updateProduk(produk.id, {
          nama: data.nama,
          deskripsi: data.deskripsi,
          harga: data.harga,
          stok: data.stok,
          subkategori_id: data.subkategori_id,
          brand_id: data.brand_id,
          status: data.status,
          gambar: selectedFiles,
        });
        toast.success("Produk berhasil diperbarui");
        triggerProductRefresh();
      } else {
        // Create
        await createProduk({
          ...data,
          gambar: selectedFiles,
        });
        toast.success("Produk berhasil dibuat");
        triggerProductRefresh();
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  // Count total images (existing + new), excluding deleted ones
  const existingImages =
    produk?.gambar?.filter((img) => !deletedImages.includes(img)) || [];
  const totalImages = existingImages.length + selectedFiles.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama produk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi produk"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan harga"
                      value={hargaDisplay}
                      onChange={(e) => {
                        const value = e.target.value;
                        setHargaDisplay(value);
                        const numericValue = parseRupiah(value);
                        field.onChange(numericValue);
                      }}
                      onBlur={() => {
                        // Format on blur
                        const numericValue = form.getValues("harga");
                        setHargaDisplay(formatRupiah(numericValue));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Masukkan jumlah stok"
                      value={stokDisplay}
                      onChange={(e) => {
                        const value = e.target.value;
                        setStokDisplay(value);
                        const numericValue = parseRupiah(value);
                        field.onChange(numericValue);
                      }}
                      onBlur={() => {
                        // Format on blur
                        const numericValue = form.getValues("stok");
                        setStokDisplay(numericValue.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="kategori_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Olahraga</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Filter subkategori based on selected kategori
                      getSubkategoriPeralatanByKategoriOlahraga(value).then(
                        setSubkategoris
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori olahraga" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {kategoriOlahragas.map((kategori: any) => (
                        <SelectItem key={kategori.id} value={kategori.id}>
                          {kategori.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subkategori_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subkategori (Alat)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih subkategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subkategoris.map((subkategori: any) => (
                        <SelectItem key={subkategori.id} value={subkategori.id}>
                          {subkategori.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand: any) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      <SelectItem value="stok habis">Stok Habis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base font-semibold">
              Gambar Produk
            </FormLabel>
            {selectedFiles.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="h-8 px-2 text-xs"
              >
                Hapus Semua Gambar Baru
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Anda dapat memilih lebih dari satu gambar. Format yang didukung:
                JPG, PNG, WEBP.
                {totalImages > 0 && (
                  <span className="ml-1">Total gambar: {totalImages}</span>
                )}
              </p>
            </div>

            {/* Preview all images (existing + new) */}
            {totalImages > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Total: {totalImages} gambar ({selectedFiles.length} baru,{" "}
                  {existingImages.length} existing)
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {/* Existing images (filtered to exclude deleted ones) */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <div className="aspect-square overflow-hidden rounded-md border">
                        <img
                          src={imageUrl}
                          alt={`Existing image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index, true, imageUrl)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 py-1 text-center text-[10px] text-white">
                        Existing
                      </div>
                    </div>
                  ))}

                  {/* New selected files */}
                  {selectedFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <div className="aspect-square overflow-hidden rounded-md border">
                        <img
                          src={previewUrls[index]}
                          alt={`Preview ${file.name}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground"
                      >
                        ×
                      </button>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading
              ? "Menyimpan..."
              : produk
              ? "Perbarui Produk"
              : "Buat Produk"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
