"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSubkategoriPeralatan, updateSubkategoriPeralatan } from "@/components/lib/services/subkategori-peralatan.service"
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service"

interface SubkategoriPeralatanFormProps {
  initialData?: {
    id?: string
    nama?: string
    kategori_olahraga_id?: string
  }
}

export function SubkategoriPeralatanForm({ initialData }: SubkategoriPeralatanFormProps) {
  const router = useRouter()

  const [nama, setNama] = useState(initialData?.nama || "")
  const [kategoriOlahragaId, setKategoriOlahragaId] = useState(initialData?.kategori_olahraga_id || "")
  const [kategoriOlahragaList, setKategoriOlahragaList] = useState<{ id: string; nama: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Fetch kategori olahraga list
  useEffect(() => {
    const fetchKategoriOlahraga = async () => {
      try {
        const data = await getAllKategoriOlahraga()
        setKategoriOlahragaList(data)
      } catch (error) {
        console.error("Failed to fetch kategori olahraga:", error)
        toast.error("Gagal memuat data kategori olahraga")
      }
    }

    fetchKategoriOlahraga()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      if (initialData?.id) {
        // Update existing subkategori peralatan
        await updateSubkategoriPeralatan(initialData.id, {
          nama: nama || undefined,
          kategori_olahraga_id: kategoriOlahragaId || undefined,
        })
        toast.success("Subkategori peralatan berhasil diperbarui")
      } else {
        // Create new subkategori peralatan
        await createSubkategoriPeralatan({
          nama,
          kategori_olahraga_id: kategoriOlahragaId,
        })
        toast.success("Subkategori peralatan berhasil dibuat")
      }

      // Redirect to subkategori peralatan list
      router.push("/dashboardadmin/subkategori-peralatan")
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`Gagal ${initialData?.id ? 'memperbarui' : 'membuat'} subkategori peralatan: ${error.message}`)
      toast.error(`Gagal ${initialData?.id ? 'memperbarui' : 'membuat'} subkategori peralatan: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {errorMsg && (
        <div className="text-red-500 text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="nama">Nama</Label>
          <Input
            id="nama"
            type="text"
            placeholder="Masukkan nama subkategori"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="kategori_olahraga_id">Kategori Olahraga</Label>
          <Select value={kategoriOlahragaId} onValueChange={setKategoriOlahragaId} required={!initialData?.id}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori olahraga" />
            </SelectTrigger>
            <SelectContent>
              {kategoriOlahragaList.map((kategori) => (
                <SelectItem key={kategori.id} value={kategori.id}>
                  {kategori.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboardadmin/subkategori-peralatan")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : initialData?.id ? "Perbarui Subkategori" : "Buat Subkategori"}
          </Button>
        </div>
      </form>
    </div>
  )
}