"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBrand, updateBrand } from "@/components/lib/services/brand.service"

interface BrandFormProps {
  initialData?: {
    id?: string
    nama?: string
    deskripsi?: string
    logo?: string
  }
}

export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter()

  const [nama, setNama] = useState(initialData?.nama || "")
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "")
  const [logo, setLogo] = useState(initialData?.logo || "")
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      if (initialData?.id) {
        // Update existing brand
        await updateBrand(initialData.id, {
          nama,
          deskripsi,
          logo: logoFile,
        });
        toast.success("Brand berhasil diperbarui")
      } else {
        // Create new brand
        await createBrand({
          nama,
          deskripsi,
          logo: logoFile || undefined,
        });
        toast.success("Brand berhasil dibuat")
      }

      // Redirect to brand list
      router.push("/dashboardadmin/brand")
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`Gagal ${initialData?.id ? 'memperbarui' : 'membuat'} brand: ${error.message}`)
      toast.error(`Gagal ${initialData?.id ? 'memperbarui' : 'membuat'} brand: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {errorMsg && (
        <div className="text-red-500 text-sm text-center">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            placeholder="Masukkan nama brand"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            type="text"
            placeholder="Masukkan deskripsi brand"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="logo">Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setLogoFile(file);
                setLogo(URL.createObjectURL(file));
              }
            }}
          />
          {logo && (
            <img
              src={logo}
              alt="Pratinjau Logo"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboardadmin/brand")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Menyimpan..."
              : initialData?.id
                ? "Perbarui Brand"
                : "Buat Brand"}
          </Button>
        </div>
      </form>
    </div>
  );
}
