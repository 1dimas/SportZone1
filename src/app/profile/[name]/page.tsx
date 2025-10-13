"use client"

import React from "react"
import { useParams } from "next/navigation"
import { getAllCustomers } from "@/components/lib/services/customer.service"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfileByNamePage() {
	const params = useParams<{ name: string }>()
	const usernameParam = typeof params?.name === "string" ? params.name : ""
	const [state, setState] = React.useState<
		| { status: "idle" }
		| { status: "loading" }
		| { status: "error"; message: string }
		| { status: "success"; user: { id: string; username: string; email: string } | null }
	>({ status: "idle" })

	React.useEffect(() => {
		let cancelled = false
		async function run() {
			if (!usernameParam) return
			setState({ status: "loading" })
			try {
				const customers = await getAllCustomers()
				const user = customers.find((c: any) => (c.username || "").toLowerCase() === usernameParam.toLowerCase()) || null
				if (!cancelled) setState({ status: "success", user })
			} catch (e: any) {
				if (!cancelled) setState({ status: "error", message: e?.message || "Gagal memuat profil" })
			}
		}
		run()
		return () => { cancelled = true }
	}, [usernameParam])

	if (!usernameParam) {
		return (
			<div className="container mx-auto px-4 py-10">
				<Card>
					<CardHeader>
						<CardTitle>Profil</CardTitle>
					</CardHeader>
					<CardContent>Nama pengguna tidak valid.</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-10">
			<Card>
				<CardHeader>
					<CardTitle>Profil: {usernameParam}</CardTitle>
				</CardHeader>
				<CardContent>
					{state.status === "loading" && <div>Memuat...</div>}
					{state.status === "error" && <div className="text-red-600">{state.message}</div>}
					{state.status === "success" && (
						state.user ? (
							<div className="flex items-center gap-4">
								<Avatar className="size-16">
									<AvatarFallback>{(state.user.username || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
								</Avatar>
								<div>
									<div className="text-lg font-semibold">{state.user.username}</div>
									<div className="text-muted-foreground text-sm">{state.user.email}</div>
								</div>
							</div>
						) : (
							<div>Pengguna tidak ditemukan.</div>
						)
					)}
				</CardContent>
			</Card>
		</div>
	)
}


