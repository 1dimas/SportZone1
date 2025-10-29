"use client"

import React from "react"
// import { useParams } from "next/navigation" // <-- Dihapus karena error di previewer
// Mock function, ganti dengan import aslimu
// import { getProfileByUserId } from "@/components/lib/services/auth.service"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card" // Tambah CardFooter
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import page from "@/app/page"

// --- (MOCK) Ganti dengan import asli dari lucide-react ---
// Anggap saja kita punya ikon-ikon ini
const Ghost = () => <span>👻</span>
const Copy = () => <span>📋</span>
const Check = () => <span>✅</span>
const MessageCircle = () => <span>💬</span>
const History = () => <span>📜</span>
// const ArrowLeft = () => <span>↩️</span> // <-- DIGANTI
// Ganti ArrowLeft dengan SVG panah asli
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || "h-4 w-4"} // Menerima className prop
  >
    <path d="M19 12H5"></path>
    <path d="M12 19l-7-7 7-7"></path>
  </svg>
)
const Package = () => <span>📦</span>
const Heart = () => <span>❤️</span>
const Star = () => <span>⭐</span>
// --- End of Mock ---

// (MOCK) Mock 'useParams' untuk lingkungan preview.
// Hapus ini jika 'next/navigation' sudah tersedia di environment-mu.
const useParams = () => {
  console.log("Menggunakan mock useParams. Ganti userId di sini untuk tes.");
  // Ganti '123-abc-xyz' dengan '404' untuk tes error not found
  return { userId: "123-abc-xyz" }; 
};

// (MOCK) Fungsi getProfileByUserId, asumsikan ini ada di file lain
// Ganti ini dengan import aslimu
const getProfileByUserId = async (userId: string) => {
  // Simulasi network delay
  await new Promise(res => setTimeout(res, 1500));
  
  // Simulasi data sukses
  if (userId === "123-abc-xyz") {
    return { 
      id: "123-abc-xyz-uuid-string-long", 
      username: "Dimas", 
      email: "dimas@sportzone.io",
      // Tambahkan data lain jika ada
      stats: {
        orders: 5,
        favorites: 12,
        reviews: 3
      }
    }; // <-- DIPERBAIKI: Menutup objek 'return'
  }
  
  // Simulasi error "not found"
  if (userId === "404") {
    throw new Error("User tidak ditemukan (404)");
  }

  // Simulasi error server
  throw new Error("Gagal terhubung ke server (500)");
};
// --- End of Mock ---


export default function ProfileByUserIdPage() {
  const params = useParams<{ userId: string }>()
  const userIdParam = typeof params?.userId === "string" ? params.userId : ""
  
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; user: { id: string; username: string; email: string; stats: { orders: number; favorites: number; reviews: number; } } }
  >({ status: "idle" })

  // const [isCopied, setIsCopied] = React.useState(false); // <-- DIHAPUS
  
  // FUNGSI INI DIHAPUS KARENA TOMBOL COPY DIHAPUS
  /*
  const handleCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy'); // Gunakan execCommand agar kompatibel di iframe
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset setelah 2 detik
    } catch (err) {
      console.error('Gagal menyalin: ', err);
    }
    document.body.removeChild(textArea);
  }
  */

  React.useEffect(() => {
    let cancelled = false
    
    async function fetchProfile() {
      if (!userIdParam) {
        // Set status idle jika tidak ada userIdParam, akan ditangani oleh return di bawah
        setState({ status: "idle" })
        return
      }
      
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

  // Blok 'if' ini dihapus, logikanya dipindah ke dalam return utama
  /*
  if (state.status === "idle" || !userIdParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">🚫 Error</CardTitle>
              <CardDescription className="text-slate-600">
                User ID tidak valid atau tidak ditemukan di URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="mt-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <div className="container mx-auto px-4 py-16">

        {/* Tombol Kembali universal di kiri atas */}
         <Button
      variant="outline"
      size="icon"
      className="mb-6 bg-white shadow-sm hover:bg-slate-50 border-slate-200 rounded-full"
      onClick={() => router.push("")} // ✅ Ini arahkan ke /src/app/page.tsx
      aria-label="Kembali"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>

        {/* Logika dipindah ke sini */}
        {state.status === "idle" || !userIdParam ? (
          // Card Error jika ID tidak valid
          <Card className="max-w-2xl mx-auto bg-white shadow-lg border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">🚫 Error</CardTitle>
              <CardDescription className="text-slate-600">
                User ID tidak valid atau tidak ditemukan di URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {/* Tombol kembali di sini dihapus karena sudah pindah ke atas */}
              <p className="text-sm text-slate-500 mt-4">Gunakan tombol 'Kembali' di kiri atas.</p>
            </CardContent>
          </Card>
        ) : (
          // Konten Profil jika ID valid
          <div className="max-w-2xl mx-auto"> {/* Dirampingkan dari max-w-4xl */}
            
            {/* Header DIKEMBALIKAN (sebagian) */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Profil Pengguna</h1>
              {/* <p className="text-slate-600 text-lg">Informasi detail pengguna SportZone</p> */}
            </div>

            {/* Konten digabung jadi satu card, layout grid dihapus */}
            <Card className="shadow-lg bg-white border-0">
              
              {/* CardHeader DIHAPUS */}
              {/* <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Informasi Pengguna</CardTitle>
                <CardDescription>
                  {state.status === "loading" && "Memuat data..."}
                  {state.status === "error" && "Gagal memuat data"}
                  {state.status === "success" && `Data lengkap untuk ${state.user.username}`}
                </CardDescription>
              </CardHeader> */}
              
              {/* Tambahkan pt-6 untuk mengganti padding dari CardHeader yang dihapus */}
              <CardContent className="space-y-6 pt-6"> 
                
                {/* --- LOADING STATE --- */}
                {state.status === "loading" && (
                  <div className="space-y-6 animate-pulse pt-4">
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                    <div className="space-y-2"><div className="h-4 w-24 bg-slate-200 rounded"></div><div className="h-11 bg-slate-200 rounded-lg"></div></div>
                  </div>
                )}
                
                {/* --- ERROR STATE --- */}
                {state.status === "error" && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    {/* DIPERBAIKI: Tag penutup salah ketik dari </Sesi> menjadi </CardTitle> */}
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
                
                {/* --- SUCCESS STATE --- */}
                {state.status === "success" && (
                  <>
                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Username</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="font-mono text-lg text-slate-900">{state.user.username}</span>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Email</label>
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <span className="text-lg text-slate-900">{state.user.email}</span>
                      </div>
                    </div>
                    
                    {/* User ID (Dikembalikan) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">User ID</label>
                      {/* Modifikasi: Hapus flex wrapper dan tombol copy */}
                      <div className="p-3 bg-slate-50 rounded-lg border">
                        <code className="text-sm text-slate-700 break-all flex-1">{state.user.id}</code>
                        {/* Tombol Copy DIHAPUS */}
                        {/* <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          onClick={() => handleCopy(state.user.id)}
                        >
                          {isCopied ? 
                            <Check className="h-4 w-4 text-green-500" /> : 
                            <Copy className="h-4 w-4" />
                          }
                        </Button> */}
                      </div>
                    </div>

                    {/* Badge Status DIHAPUS */}
                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Status</label>
                      <div>
                        <Badge variant="outline" className="w-fit bg-orange-100 text-orange-700 border-orange-300">
                          Member
                        </Badge>
                      </div>
                    </div> */}
                  </>
                )}
              </CardContent>

              {/* Tombol Aksi dan CardFooter dihapus seluruhnya */}
              {/* {state.status === "success" && (
                <CardFooter className="flex-col sm:flex-row gap-3 pt-6 border-t mt-6">
                  <Button 
                    variant="outline"
                    className="flex-1" // Dibiarkan flex-1 agar lebarnya penuh
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                </CardFooter>
              )} */}
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}




