"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Package,
  FileText,
  DollarSign,
  Layers,
  Tag,
  Award,
  ToggleLeft,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Plus,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  const [deletedImages, setDeletedImages] = React.useState<string[]>([]);
  const [hargaDisplay, setHargaDisplay] = React.useState<string>("");
  const [stokDisplay, setStokDisplay] = React.useState<string>("");
  const [isDragOver, setIsDragOver] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatRupiah = (value: number): string => {
    return value.toLocaleString("id-ID");
  };

  const parseRupiah = (value: string): number => {
    const cleaned = value.replace(/\D/g, "");
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

  React.useEffect(() => {
    if (produk?.harga) {
      setHargaDisplay(formatRupiah(produk.harga));
    }
    if (produk?.stok) {
      setStokDisplay(produk.stok.toString());
    }
  }, [produk]);

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
      setDeletedImages([]);
    }
  }, [produk, form]);

  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    form.setValue("gambar", updatedFiles);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const removeFile = async (
    index: number,
    isExistingImage: boolean = false,
    imageUrl?: string
  ) => {
    if (isExistingImage && imageUrl && produk) {
      try {
        await deleteGambarProduk(produk.id, imageUrl);
        setDeletedImages((prev) => [...prev, imageUrl]);
        toast.success("Gambar berhasil dihapus");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Gagal menghapus gambar");
        return;
      }
    } else {
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
      form.setValue("gambar", newFiles);

      const newPreviewUrls = [...previewUrls];
      URL.revokeObjectURL(newPreviewUrls[index]);
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const clearAllFiles = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    form.setValue("gambar", []);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProdukFormData) => {
    setLoading(true);
    try {
      if (produk) {
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

  const existingImages =
    produk?.gambar?.filter((img) => !deletedImages.includes(img)) || [];
  const totalImages = existingImages.length + selectedFiles.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section 1: Informasi Dasar */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            Informasi Dasar
          </h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Nama Produk
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Masukkan nama produk" 
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Deskripsi
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        placeholder="Masukkan deskripsi produk"
                        className="pl-10 min-h-[120px] rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors resize-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 2: Harga & Stok */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            Harga & Stok
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Harga (Rp)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Masukkan harga"
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
                        value={hargaDisplay}
                        onChange={(e) => {
                          const value = e.target.value;
                          setHargaDisplay(value);
                          const numericValue = parseRupiah(value);
                          field.onChange(numericValue);
                        }}
                        onBlur={() => {
                          const numericValue = form.getValues("harga");
                          setHargaDisplay(formatRupiah(numericValue));
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Stok
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Masukkan jumlah stok"
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
                        value={stokDisplay}
                        onChange={(e) => {
                          const value = e.target.value;
                          setStokDisplay(value);
                          const numericValue = parseRupiah(value);
                          field.onChange(numericValue);
                        }}
                        onBlur={() => {
                          const numericValue = form.getValues("stok");
                          setStokDisplay(numericValue.toString());
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 3: Kategori & Brand */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            Kategori & Brand
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="kategori_id"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Kategori Olahraga
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      getSubkategoriPeralatanByKategoriOlahraga(value).then(
                        setSubkategoris
                      );
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Subkategori (Alat)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                        <Layers className="w-4 h-4 text-gray-400 mr-2" />
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Brand
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                        <Award className="w-4 h-4 text-gray-400 mr-2" />
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                        <ToggleLeft className="w-4 h-4 text-gray-400 mr-2" />
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

        {/* Section 4: Gambar Produk */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </div>
              Gambar Produk
            </h3>
            {selectedFiles.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3 mr-1" />
                Hapus Semua Baru
              </Button>
            )}
          </div>
          
          {/* Drag & Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragOver 
                ? "border-orange-400 bg-orange-50" 
                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-gray-600 mb-2">
              Drag & drop gambar atau <span className="text-orange-500 font-medium">klik untuk upload</span>
            </p>
            <p className="text-xs text-gray-400">
              Format: JPG, PNG, WEBP
            </p>
            <Input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>

          {/* Image Previews */}
          {totalImages > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Total: {totalImages} gambar
                  {selectedFiles.length > 0 && existingImages.length > 0 && (
                    <span className="text-xs ml-1">
                      ({selectedFiles.length} baru, {existingImages.length} existing)
                    </span>
                  )}
                </p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {/* Existing images */}
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={`Existing image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, true, imageUrl)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 text-center text-[10px] text-white rounded-b-xl">
                      Existing
                    </div>
                  </div>
                ))}

                {/* New selected files */}
                {selectedFiles.map((file, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-xl border-2 border-orange-200 bg-orange-50">
                      <img
                        src={previewUrls[index]}
                        alt={`Preview ${file.name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-orange-500 py-1 text-center text-[10px] text-white rounded-b-xl">
                      Baru
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6 border-t">
          <p className="text-sm text-gray-500 hidden sm:block">
            <span className="text-orange-500">*</span> Semua field wajib diisi
          </p>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 rounded-xl gap-2 px-8 w-full sm:w-auto shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : produk ? (
              <>
                <Save className="w-4 h-4" />
                Perbarui Produk
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Buat Produk
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
