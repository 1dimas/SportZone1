"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createKategoriOlahraga, updateKategoriOlahraga } from "@/components/lib/services/olahraga.service"
import { triggerKategoriOlahragaRefresh } from "@/components/lib/utils/kategori-olahraga-refresh"

interface KategoriOlahragaFormProps {
  initialData?: {
    id?: string
    nama?: string
  }
  onSuccess?: () => void
}

export function KategoriOlahragaForm({ initialData, onSuccess }: KategoriOlahragaFormProps) {
  const router = useRouter()
  
  const [nama, setNama] = useState(initialData?.nama || "")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      if (initialData?.id) {
        // Update existing kategori olahraga
        await updateKategoriOlahraga(initialData.id, {
          nama: nama || undefined,
        })
        toast.success("Kategori olahraga updated successfully")
        triggerKategoriOlahragaRefresh()
      } else {
        // Create new kategori olahraga
        await createKategoriOlahraga({
          nama,
        })
        toast.success("Kategori olahraga created successfully")
        triggerKategoriOlahragaRefresh()
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        // Redirect to kategori olahraga list only if no onSuccess callback
        router.push("/dashboardadmin/olahraga")
      }
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`Failed to ${initialData?.id ? 'update' : 'create'} kategori olahraga: ${error.message}`)
      toast.error(`Failed to ${initialData?.id ? 'update' : 'create'} kategori olahraga: ${error.message}`)
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter category name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>
        
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboardadmin/olahraga")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData?.id ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </div>
  )
}