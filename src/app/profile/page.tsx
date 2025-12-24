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
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

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
  const [updateSuccess, setUpdateSuccess] = React.useState(false);

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
    setUpdateSuccess(false);
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
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (e: any) {
      setUpdateError(e?.message || "Gagal update profil");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-gray-600 hover:text-orange-500 hover:bg-orange-50 -ml-2"
            onClick={() => router.push("/home")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
              <p className="text-gray-500 text-sm">Kelola informasi akun Anda</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Profil berhasil diperbarui!</span>
          </div>
        )}

        {/* Profile Card */}
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <User className="w-4 h-4 text-orange-600" />
              </div>
              Informasi Akun
            </CardTitle>
            <CardDescription>Data profil customer Anda</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Loading State */}
            {state.status === "loading" && (
              <div className="space-y-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
              </div>
            )}

            {/* Error State */}
            {state.status === "error" && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{state.message}</span>
              </div>
            )}

            {/* Success State */}
            {state.status === "success" && (
              <>
                {updateError && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{updateError}</span>
                  </div>
                )}

                {!isEditing ? (
                  // View Mode
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </Label>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
                        {state.user.username}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
                        {state.user.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        No. Telepon
                      </Label>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
                        {state.user.phone || "-"}
                      </div>
                    </div>

                    <Button
                      onClick={handleEdit}
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 font-medium shadow-sm mt-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profil
                    </Button>
                  </>
                ) : (
                  // Edit Mode
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
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
                        className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500" />
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
                        className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-500" />
                        No. Telepon
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="08123456789"
                        className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                      />
                    </div>

                    <div className="flex gap-3 mt-2">
                      <Button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 font-medium"
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Simpan
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} SportZone. All rights reserved.
        </p>
      </div>
    </div>
  );
}
