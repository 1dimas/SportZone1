"use client"

import React from "react"
// IMPORT ASLI - BUKAN MOCK
import { useParams, useRouter } from "next/navigation" 
import { getProfileByUserId, UserProfile } from "@/components/lib/services/auth.service" 
import { ArrowLeft } from "lucide-react" 

// IMPORT KOMPONEN UI (Pastikan semua ada di proyekmu)
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// --- SEMUA BLOK MOCK SUDAH DIHAPUS ---

export default function ProfileByUserIdPage() {
  // Gunakan router dan params asli
  const router = useRouter() 
  const params = useParams<{ userId: string }>() 
  const userIdParam = typeof params?.userId === "string" ? params.userId : ""
  
  // State menggunakan interface UserProfile asli
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; user: UserProfile } 
  >({ status: "idle" })


  React.useEffect(() => {
    let cancelled = false
    
    async function fetchProfile() {
      // Cek jika param tidak ada
      if (!userIdParam) {
        setState({ status: "idle" })
        return
      }
      
      setState({ status: "loading" })
      
      try {
        // Memanggil FUNGSI ASLI (via fetch)
        const user = await getProfileByUserId(userIdParam)
        if (!cancelled) {
          setState({ status: "success", user })
        }
      } catch (error: any) {
        if (!cancelled) {
          setState({ 
            status: "error", 
            message: error?.message || "Gagal memuat profil" 
          })
        }
      }
    }

    // Panggil fungsi fetch
    fetchProfile()
    
    return () => {
      cancelled = true
    }
  }, [userIdParam]) // <-- Dependency array sudah benar

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="container mx-auto px-4 py-16">

        {/* Tombol Kembali (sudah diperbaiki) */}
         <Button
            variant="outline"
            size="icon"
            className="mb-6 bg-white shadow-sm hover:bg-slate-50 border-slate-200 rounded-full"
            onClick={() => router.push("/")} // <-- Mengarah ke homepage
            aria-label="Kembali"
          >
          <ArrowLeft className="h-4 w-4" /> {/* <-- Ikon asli */}
        </Button>

        {/* 1. Tampilan jika ID tidak ada di URL */}
        {state.status === "idle" || !userIdParam ? (
          <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">🚫 Error</CardTitle>
              <CardDescription className="text-slate-600">
                User ID tidak valid atau tidak ditemukan di URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500 mt-4">Gunakan tombol 'Kembali' di kiri atas.</p>
            </CardContent>
          </Card>
        
        ) : (
          // 2. Tampilan jika ID ada (Loading, Error, Sukses)
          <div className="max-w-2xl mx-auto">
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Profil Pengguna</h1>
            </div>

            <Card className="shadow-lg bg-white border-0">
              <CardContent className="space-y-6 pt-6"> 
                
                {/* --- LOADING STATE --- */}
                {state.status === "loading" && (
                  <div className="space-y-6 animate-pulse pt-4">
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                  </div>
                )}
                
                {/* --- ERROR STATE (dari fetch) --- */}
                {state.status === "error" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    <CardTitle className="text-red-600 mb-2">Gagal Memuat</CardTitle>
                    <CardDescription className="text-red-500 mb-4">
                      {/* Ini akan menampilkan "User tidak ditemukan" atau error server */}
                      {state.message}
                    </CardDescription>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline"
                      size="sm"
                    >
                      Coba Lagi
                    </Button>
                  </div>
                )}
                
                {/* --- SUCCESS STATE --- */}
                {state.status === "success" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Username</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="font-mono text-lg text-slate-900">{state.user.username}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Email</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-lg text-slate-900">{state.user.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">No. Telepon</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-lg text-slate-900">{state.user.phone || "-"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">User ID</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <code className="text-sm text-slate-700 break-all flex-1">{state.user.id}</code>
                      </div>
                    </div>

                    {/* Tambahkan data 'stats' jika perlu */}
                    {state.user.stats && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">Statistik</label>
                        <div className="flex gap-4">
                          <div className="p-3 bg-slate-50 rounded-lg border flex-1 text-center">
                            <span className="text-lg font-bold">{state.user.stats.orders}</span>
                            <span className="text-sm text-slate-600 block">Pesanan</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border flex-1 text-center">
                            <span className="text-lg font-bold">{state.user.stats.favorites}</span>
                            <span className="text-sm text-slate-600 block">Favorit</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border flex-1 text-center">
                            <span className="text-lg font-bold">{state.user.stats.reviews}</span>
                            <span className="text-sm text-slate-600 block">Ulasan</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}
