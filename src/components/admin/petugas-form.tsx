"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPetugas, updatePetugas } from "@/components/lib/services/petugas.service"

interface PetugasFormProps {
  initialData?: {
    id?: string
    username?: string
    email?: string
  }
}

export function PetugasForm({ initialData }: PetugasFormProps) {
  const router = useRouter()
  
  const [username, setUsername] = useState(initialData?.username || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      if (initialData?.id) {
        // Update existing petugas
        await updatePetugas(initialData.id, {
          username: username || undefined,
          email: email || undefined,
          password: password || undefined,
        })
        toast.success("Petugas updated successfully")
      } else {
        // Create new petugas
        await createPetugas({
          username,
          email,
          password,
        })
        toast.success("Petugas created successfully")
      }
      
      // Redirect to petugas list
      router.push("/dashboardadmin/petugas")
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`Failed to ${initialData?.id ? 'update' : 'create'} petugas`)
      toast.error(`Failed to ${initialData?.id ? 'update' : 'create'} petugas`)
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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="password">
            {initialData?.id ? "New Password (optional)" : "Password"}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={initialData?.id ? "Enter new password" : "Enter password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!initialData?.id} // Required for create, optional for update
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboardadmin/petugas")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData?.id ? "Update Petugas" : "Create Petugas"}
          </Button>
        </div>
      </form>
    </div>
  )
}