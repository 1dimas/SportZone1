"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createBanner, updateBanner, LinkType } from "@/components/lib/services/banner.service"
import { getAllBrands } from "@/components/lib/services/brand.service"
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service"
import { getAllProduk } from "@/components/lib/services/produk.service"

interface BannerFormProps {
  initialData?: {
    id?: string
    title?: string | null
    image_url?: string | null
    link_type?: LinkType
    link_value?: string
    is_active?: boolean
    start_date?: string | null
    end_date?: string | null
  }
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || "")
  const [linkType, setLinkType] = useState<LinkType>(initialData?.link_type || "product")
  const [linkValue, setLinkValue] = useState(initialData?.link_value || "")
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [startDate, setStartDate] = useState(initialData?.start_date || "")
  const [endDate, setEndDate] = useState(initialData?.end_date || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [categories, setCategories] = useState<Array<{ id: string; nama: string }>>([])
  const [products, setProducts] = useState<Array<{ id: string; nama: string }>>([])
  const [showHelper, setShowHelper] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    const fetchHelperData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getAllKategoriOlahraga(),
          getAllProduk()
        ])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [categoriesData])
        setProducts(Array.isArray(productsData) ? productsData : [productsData])
      } catch (error) {
        console.error("Failed to fetch helper data:", error)
      }
    }
    fetchHelperData()
  }, [])

  useEffect(() => {
    setShowHelper(false)
  }, [linkType])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (initialData?.id) {
        await updateBanner(
          initialData.id,
          {
            title,
            link_type: linkType,
            link_value: linkValue,
            is_active: isActive,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            image: imageFile || undefined,
          },
          token
        )
        toast.success("Banner updated successfully")
      } else {
        await createBanner(
          {
            title,
            link_type: linkType,
            link_value: linkValue,
            is_active: isActive,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            image: imageFile || undefined,
          },
          token
        )
        toast.success("Banner created successfully")
      }

      router.push("/dashboardadmin/banner")
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`Failed to ${initialData?.id ? 'update' : 'create'} banner: ${error.message}`)
      toast.error(`Failed to ${initialData?.id ? 'update' : 'create'} banner: ${error.message}`)
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter banner title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="image">Banner Image</Label>
          {imagePreview && (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="text-sm text-muted-foreground">
            Upload banner image (recommended: 1920x500px)
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="linkType">Link Type</Label>
          <Select value={linkType} onValueChange={(value) => setLinkType(value as LinkType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select link type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="linkValue">Link Value</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowHelper(!showHelper)}
            >
              {showHelper ? "Hide" : "Show"} {linkType === "category" ? "Categories" : "Products"}
            </Button>
          </div>

          {showHelper && linkType === "category" && categories.length > 0 && (
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50 mb-2">
              <p className="text-sm font-semibold mb-2">Available Categories (click to select):</p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="w-full text-left text-sm p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Category selected:", cat.nama)
                      setLinkValue(cat.nama)
                      setShowHelper(false)
                    }}
                  >
                    <span className="font-medium">{cat.nama}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHelper && linkType === "product" && products.length > 0 && (
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50 mb-2">
              <p className="text-sm font-semibold mb-2">Available Products (click to select):</p>
              <div className="space-y-1">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full text-left text-sm p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Product selected:", product.id, product.nama)
                      setLinkValue(product.id)
                      setShowHelper(false)
                    }}
                  >
                    <span className="font-medium">{product.nama}</span>
                    <span className="text-gray-500 ml-2 text-xs">ID: {product.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            id="linkValue"
            type="text"
            placeholder={`Enter ${linkType} ID or value`}
            value={linkValue || ""}
            onChange={(e) => {
              console.log("Link value changed:", e.target.value)
              setLinkValue(e.target.value)
            }}
            autoComplete="off"
            required
          />
          <p className="text-sm text-muted-foreground">
            {linkType === "product" && "Enter product ID (e.g., abc123-def456). Product ID can be found in the product list."}
            {linkType === "category" && "Enter category name (e.g., Futsal, Basket). You can select from the list above or type manually."}
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="startDate">Start Date (Optional)</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked as boolean)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Active
          </Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData?.id ? "Update Banner" : "Create Banner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboardadmin/banner")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
