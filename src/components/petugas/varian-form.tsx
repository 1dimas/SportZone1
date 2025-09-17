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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  createVarian,
  updateVarian,
} from "@/components/lib/services/varian.service"

const varianSchema = z.object({
  ukuran: z.string().optional(),
  warna: z.string().optional(),
  stok: z.number().min(0, "Stok harus positif"),
  harga: z.number().optional(),
  sku: z.string().optional(),
})

type VarianFormData = z.infer<typeof varianSchema>

interface VarianFormProps {
  produkId: string
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

export function VarianForm({ produkId, varian, onSuccess }: VarianFormProps) {
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
      if (varian) {
        await updateVarian(varian.id, data)
        toast.success("Varian berhasil diperbarui")
      } else {
        await createVarian({ ...data, produk_id: produkId })
        toast.success("Varian berhasil dibuat")
      }
      onSuccess()
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
