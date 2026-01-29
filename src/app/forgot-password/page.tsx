"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, verifyOtp, resetPassword } from "@/components/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await forgotPassword(email);
      setStep("otp");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal kirim OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await verifyOtp(email, otp);
      setStep("password");
    } catch (err: any) {
      setErrorMsg(err.message || "OTP tidak valid");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await resetPassword(email, otp, newPassword);
      setStep("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Kata Sandi Berhasil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Kata sandi berhasil direset.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Kembali ke Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === "email" && "Lupa Kata Sandi"}
            {step === "otp" && "Verifikasi OTP"}
            {step === "password" && "Reset Kata Sandi"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errorMsg}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleForgotPassword}>
              <div className="grid gap-3 mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <div className="grid gap-3 mb-4">
                <Label htmlFor="otp">Kode OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memverifikasi..." : "Verifikasi OTP"}
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-3 mb-4">
                <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Kata sandi baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mereset..." : "Reset Kata Sandi"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm mt-4">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="underline underline-offset-4"
            >
              Kembali ke Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
