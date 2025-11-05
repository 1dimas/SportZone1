"use client"

import React from "react"
import { getProfile, UserProfile } from "@/components/lib/services/auth.service"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; user: UserProfile }
  >({ status: "idle" })

  React.useEffect(() => {
    let cancelled = false
    async function run() {
      setState({ status: "loading" })
      try {
        const data = await getProfile()
        if (!cancelled) setState({ status: "success", user: data })
      } catch (e: any) {
        if (!cancelled) setState({ status: "error", message: e?.message || "Gagal memuat profil" })
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="outline"
          size="icon"
          className="mb-6 bg-white shadow-sm hover:bg-slate-50 border-slate-200 rounded-full"
          onClick={() => router.push("/")}
          aria-label="Kembali"
        >
          ←
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Profil</h1>

          <Card className="shadow-lg bg-white border-0">
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
              <CardDescription>Data profil customer anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.status === "loading" && (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-200 rounded" />
                </div>
              )}

              {state.status === "error" && (
                <div className="text-red-600">{state.message}</div>
              )}

              {state.status === "success" && (
                <>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600">Username</div>
                    <div className="p-3 bg-slate-50 rounded border">{state.user.username}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600">Email</div>
                    <div className="p-3 bg-slate-50 rounded border">{state.user.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600">No. Telepon</div>
                    <div className="p-3 bg-slate-50 rounded border">{state.user.phone || "-"}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

