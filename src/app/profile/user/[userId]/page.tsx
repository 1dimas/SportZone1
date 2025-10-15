"use client"

import React from "react"
import { useParams } from "next/navigation"
import { getProfileByUserId } from "@/components/lib/services/auth.service"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <p>User ID tidak valid.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profil User</CardTitle>
        </CardHeader>
        <CardContent>
          {state.status === "loading" && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span>Memuat profil...</span>
            </div>
          )}
          
          {state.status === "error" && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg">
              <strong>Error:</strong> {state.message}
            </div>
          )}
          
          {state.status === "success" && (
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">
                  {(state.user.username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="text-xl font-semibold">
                  {state.user.username}
                </div>
                <div className="text-muted-foreground">
                  {state.user.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {state.user.id}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
