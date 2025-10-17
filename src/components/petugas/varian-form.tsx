"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

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
  sku: z.string().optional(),
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
    sku?: string
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
      sku: varian?.sku || "",
    },
  })

  const onSubmit = async (data: VarianFormData) => {
    setLoading(true)
    try {
      // Clean up empty strings to undefined for optional fields
      const cleanData = {
        ukuran: data.ukuran && data.ukuran.trim() !== "" ? data.ukuran.trim() : undefined,
        warna: data.warna && data.warna.trim() !== "" ? data.warna.trim() : undefined,
        stok: data.stok,
        // If harga is 0 or undefined, use hargaProduk (if available)
        harga: (data.harga === 0 || data.harga === null || data.harga === undefined) && hargaProduk
          ? hargaProduk
          : data.harga,
        sku: data.sku && data.sku.trim() !== "" ? data.sku.trim() : undefined,
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
      })} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="ukuran"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ukuran</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan ukuran" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warna</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan warna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="stok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan stok"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? 0 : Number(value))
                      }}
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
                      type="number"
                      placeholder="Masukkan harga"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? undefined : Number(value))
                      }}
                    />
                  </FormControl>
                  {hargaProduk && (
                    <FormDescription>
                      Kosongkan atau isi 0 untuk menggunakan harga produk (Rp {hargaProduk.toLocaleString('id-ID')})
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Menyimpan..." : varian ? "Perbarui Varian" : "Buat Varian"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
