"use client";

import React from "react";
import {
  getProfile,
  UserProfile,
  updateCustomerProfile,
} from "@/components/lib/services/auth.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; user: UserProfile }
  >({ status: "idle" });

  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    username: "",
    email: "",
    phone: "",
  });
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [updateError, setUpdateError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      setState({ status: "loading" });
      try {
        const data = await getProfile();
        if (!cancelled) {
          setState({ status: "success", user: data });
          setEditForm({
            username: data.username,
            email: data.email,
            phone: data.phone || "",
          });
        }
      } catch (e: any) {
        if (!cancelled)
          setState({
            status: "error",
            message: e?.message || "Gagal memuat profil",
          });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (state.status === "success") {
      setEditForm({
        username: state.user.username,
        email: state.user.email,
        phone: state.user.phone || "",
      });
    }
  };

  const handleSave = async () => {
    if (state.status !== "success") return;

    setUpdateLoading(true);
    setUpdateError("");
    try {
      const updatedUser = await updateCustomerProfile(state.user.id, editForm);
      setState({ status: "success", user: { ...state.user, ...updatedUser } });
      setIsEditing(false);
    } catch (e: any) {
      setUpdateError(e?.message || "Gagal update profil");
    } finally {
      setUpdateLoading(false);
    }
  };

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
                  {updateError && (
                    <div className="text-red-600">{updateError}</div>
                  )}

                  {!isEditing ? (
                    <>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-600">Username</div>
                        <div className="p-3 bg-slate-50 rounded border">
                          {state.user.username}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-600">Email</div>
                        <div className="p-3 bg-slate-50 rounded border">
                          {state.user.email}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-600">
                          No. Telepon
                        </div>
                        <div className="p-3 bg-slate-50 rounded border">
                          {state.user.phone || "-"}
                        </div>
                      </div>
                      <Button
                        onClick={handleEdit}
                        className="w-full bg-[#FB8C00] hover:bg-orange-600 text-white"
                      >
                        Edit Profil
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="username"
                          className="font-semibold text-[#FB8C00]"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="email"
                          className="font-semibold text-[#FB8C00]"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="phone"
                          className="font-semibold text-[#FB8C00]"
                        >
                          No. Telepon
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={updateLoading}
                          className="flex-1 bg-[#FB8C00] hover:bg-orange-600 text-white"
                        >
                          {updateLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
