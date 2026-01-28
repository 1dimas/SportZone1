"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { 
  Ruler, 
  Palette, 
  Package, 
  DollarSign, 
  Barcode,
  Loader2,
  Plus,
  Save,
  Layers,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  createVarian,
  updateVarian,
} from "@/components/lib/services/varian.service"

const varianSchema = z.object({
  ukuran: z.string().optional(),
  warna: z.string().optional(),
  stok: z.number().min(0, "Stok minimal 0"),
  harga: z.number().optional().nullable(),
})

type VarianFormData = z.infer<typeof varianSchema>

interface VarianFormProps {
  produkId: string
  hargaProduk?: number
  varian?: {
    id: string
    produk_id: string
    ukuran?: string
    warna?: string
    stok: number
    harga?: number
  }
  onSuccess: () => void
}

export function VarianForm({ produkId, hargaProduk, varian, onSuccess }: VarianFormProps) {
  const [loading, setLoading] = React.useState(false)

  const form = useForm<VarianFormData>({
    resolver: zodResolver(varianSchema),
    defaultValues: {
      ukuran: varian?.ukuran || "",
      warna: varian?.warna || "",
      stok: varian?.stok || 0,
      harga: varian?.harga || undefined,
    },
  })

  const onSubmit = async (data: VarianFormData) => {
    setLoading(true)
    try {
      const cleanData = {
        ukuran: data.ukuran && data.ukuran.trim() !== "" ? data.ukuran.trim() : undefined,
        warna: data.warna && data.warna.trim() !== "" ? data.warna.trim() : undefined,
        stok: data.stok,
        harga: (data.harga === 0 || data.harga === null || data.harga === undefined) && hargaProduk
          ? hargaProduk
          : data.harga,
      }

      console.log("Submitting varian data:", cleanData)

      if (varian) {
        await updateVarian(varian.id, cleanData)
        toast.success("Varian berhasil diperbarui")
      } else {
        await createVarian({ ...cleanData, produk_id: produkId })
        toast.success("Varian berhasil dibuat")
      }
      onSuccess()
    } catch (error) {
      console.error("Error submitting varian:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors)
        toast.error("Mohon periksa kembali isian form")
      })} className="space-y-8">
        
        {/* Section: Atribut Varian */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-orange-600" />
            </div>
            Atribut Varian
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ukuran"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Ukuran
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Contoh: XL, 42, L" 
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
              name="warna"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Warna
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Contoh: Merah, Biru, Hitam" 
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
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

        {/* Section: Stok & Harga */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            Stok & Harga
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        type="number"
                        placeholder="Jumlah stok"
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === "" ? 0 : Number(value))
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
                        type="number"
                        placeholder="Harga varian"
                        className="pl-10 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-colors"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === "" ? undefined : Number(value))
                        }}
                      />
                    </div>
                  </FormControl>
                  {hargaProduk && (
                    <FormDescription className="text-xs flex items-center gap-1">
                      <span className="text-orange-500">💡</span>
                      Kosongkan untuk menggunakan harga produk (Rp {hargaProduk.toLocaleString('id-ID')})
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6 border-t">
          <p className="text-sm text-gray-500 hidden sm:block">
            <span className="text-orange-500">*</span> Isi minimal ukuran atau warna
          </p>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 rounded-xl gap-2 px-6 w-full sm:w-auto shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : varian ? (
              <>
                <Save className="w-4 h-4" />
                Perbarui Varian
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Buat Varian
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
