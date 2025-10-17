"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Edit, Package, Image as ImageIcon, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getProdukById, getVarianByProduk } from "@/components/lib/services/produk.service"
import { deleteVarian } from "@/components/lib/services/varian.service"

interface ProdukDetail {
  id: string
  nama: string
  deskripsi: string
  harga: number
  status: string
  gambar?: string[]
  subkategori?: {
    id: string
    nama: string
    kategoriOlahraga?: {
      id: string
      nama: string
    }
  }
  brand?: {
    id: string
    nama: string
    deskripsi?: string
    logo?: string
  }
  varian?: any[]
  created_at: string
  updated_at: string
}

export default function ProdukDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [produk, setProduk] = React.useState<ProdukDetail | null>(null)
  const [varian, setVarian] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedImage, setSelectedImage] = React.useState<string>("")

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkData, varianData] = await Promise.all([
          getProdukById(params.id as string),
          getVarianByProduk(params.id as string)
        ])
        setProduk(produkData)
        setVarian(varianData)
        if (produkData.gambar && produkData.gambar.length > 0) {
          setSelectedImage(produkData.gambar[0])
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
        toast.error("Gagal memuat detail produk")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'nonaktif':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      case 'stok habis':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const handleDeleteVarian = async (varianId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus varian ini?")) {
      return
    }

    try {
      await deleteVarian(varianId)
      // Remove from local state
      setVarian(prev => prev.filter(v => v.id !== varianId))
      toast.success("Varian berhasil dihapus")
    } catch (error) {
      console.error("Error deleting variant:", error)
      toast.error("Gagal menghapus varian")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!produk) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Produk tidak ditemukan</h1>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{produk.nama}</h1>
            <p className="text-gray-600">Detail Produk</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/dashboardpetugas/produk/${produk.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Produk
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={produk.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {produk.gambar && produk.gambar.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {produk.gambar.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === image
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${produk.nama} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Informasi Produk</CardTitle>
                <Badge className={getStatusColor(produk.status)}>
                  {produk.status === 'aktif' ? 'Aktif' :
                   produk.status === 'nonaktif' ? 'Nonaktif' : 'Stok Habis'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Harga</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(produk.harga)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                <p className="text-gray-900 mt-1">{produk.deskripsi}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Kategori Olahraga</label>
                  <p className="text-gray-900 mt-1">
                    {produk.subkategori?.kategoriOlahraga?.nama || 'Tidak ada'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Subkategori</label>
                  <p className="text-gray-900 mt-1">
                    {produk.subkategori?.nama || 'Tidak ada'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Brand</label>
                <div className="flex items-center gap-3 mt-1">
                  {produk.brand?.logo && (
                    <img
                      src={produk.brand.logo}
                      alt={produk.brand.nama}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-gray-900">{produk.brand?.nama || 'Tidak ada'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{produk.gambar?.length || 0}</p>
                  <p className="text-sm text-gray-600">Gambar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{varian.length}</p>
                  <p className="text-sm text-gray-600">Varian</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {varian.reduce((sum, v) => sum + (v.stok || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Stok</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for additional information */}
      <Tabs defaultValue="varian" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="varian">Varian Produk</TabsTrigger>
          <TabsTrigger value="detail">Detail Tambahan</TabsTrigger>
        </TabsList>

        <TabsContent value="varian" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Varian Produk</CardTitle>
                <Button
                  onClick={() => router.push(`/dashboardpetugas/produk/${produk.id}/varian/create`)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Varian
                </Button>
              </div>
              <CardDescription>
                Kelola varian produk seperti ukuran, warna, dan stok
              </CardDescription>
            </CardHeader>
            <CardContent>
              {varian.length > 0 ? (
                <div className="space-y-4">
                  {varian.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {item.ukuran && item.warna
                              ? `${item.ukuran} - ${item.warna}`
                              : item.ukuran || item.warna || 'Varian Default'}
                          </p>
                          <p className="text-sm text-gray-600">SKU: {item.sku || 'Tidak ada'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{item.stok} unit</p>
                          {item.harga && (
                            <p className="text-sm text-green-600">{formatCurrency(item.harga)}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVarian(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada varian untuk produk ini</p>
                  <Button
                    onClick={() => router.push(`/dashboardpetugas/produk/${produk.id}/varian/create`)}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Varian Pertama
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Waktu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dibuat</label>
                  <p className="text-gray-900">
                    {new Date(produk.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Terakhir Diupdate</label>
                  <p className="text-gray-900">
                    {new Date(produk.updated_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Produk:</span>
                    <span className="font-mono text-xs">{produk.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className={getStatusColor(produk.status)}>
                      {produk.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Gambar:</span>
                    <span>{produk.gambar?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Varian:</span>
                    <span>{varian.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
