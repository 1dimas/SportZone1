"use client"

import React from "react"
import { useParams } from "next/navigation"
import { getProfileByUserId } from "@/components/lib/services/auth.service"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ProfileByUserIdPage() {
  const params = useParams<{ userId: string }>()
  const userIdParam = typeof params?.userId === "string" ? params.userId : ""
  
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; user: { id: string; username: string; email: string } }
  >({ status: "idle" })

  React.useEffect(() => {
    let cancelled = false
    
    async function fetchProfile() {
      if (!userIdParam) return
      
      setState({ status: "loading" })
      
      try {
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

    fetchProfile()
    
    return () => {
      cancelled = true
    }
  }, [userIdParam])

  if (!userIdParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">⚠️ Error</CardTitle>
              <CardDescription>User ID tidak valid atau tidak ditemukan</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="mt-4"
              >
                ← Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Profil Pengguna</h1>
            <p className="text-slate-600">Informasi detail pengguna SportZone</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  {state.status === "loading" && (
                    <div className="space-y-4">
                      <div className="mx-auto w-24 h-24 bg-slate-200 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mx-auto"></div>
                    </div>
                  )}
                  
                  {state.status === "error" && (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">⚠️</span>
                      </div>
                      <CardTitle className="text-red-600 mb-2">Error</CardTitle>
                      <CardDescription className="text-red-500 mb-4">
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
                  
                  {state.status === "success" && (
                    <>
                      <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-slate-200">
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {(state.user.username || "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        {state.user.username}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {state.user.email}
                      </CardDescription>
                      <Badge variant="secondary" className="mt-2 w-fit mx-auto">
                        Member
                      </Badge>
                    </>
                  )}
                </CardHeader>
              </Card>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">Informasi Detail</CardTitle>
                  <CardDescription>Data lengkap pengguna</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {state.status === "success" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Username</label>
                          <div className="p-3 bg-slate-50 rounded-lg border">
                            <span className="font-mono text-slate-900">{state.user.username}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600">Email</label>
                          <div className="p-3 bg-slate-50 rounded-lg border">
                            <span className="text-slate-900">{state.user.email}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">User ID</label>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                          <code className="text-sm text-slate-700 break-all">{state.user.id}</code>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">0</div>
                          <div className="text-sm text-blue-600">Pesanan</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">0</div>
                          <div className="text-sm text-green-600">Favorit</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">0</div>
                          <div className="text-sm text-purple-600">Review</div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {state.status === "success" && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" variant="default">
                    📧 Kirim Pesan
                  </Button>
                  <Button className="flex-1" variant="outline">
                    👤 Lihat Aktivitas
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    ← Kembali
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}