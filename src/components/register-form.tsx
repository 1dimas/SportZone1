"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, API_URL } from "./lib/services/auth.service";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await register(name, email, phone, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        router.push("/home");
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Register failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = `${API_URL}/auth/google`;
    }
  }

  return (
    <div className={cn("w-full max-w-4xl", className)} {...props}>
      <Card className="overflow-hidden shadow-lg border-none bg-white focus:outline-none focus:ring-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Kolom Kiri: Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-[#FB8C00]">
                Register Your Account
              </h1>
            </div>

            {errorMsg && (
              <div className=" text-sm text-center  p-3 ">{errorMsg}</div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold text-[#FB8C00]">
                User Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-[#FB8C00]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="michael@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="font-semibold text-[#FB8C00]">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="font-semibold text-[#FB8C00]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FB8C00] hover:bg-orange-600 text-white font-bold py-3 text-base"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className=" px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Tombol Google (SUDAH DIPERBAIKI) */}
            <Button
              type="button"
              // Hapus variant="outline" dan atur stylenya di sini
              className="w-full flex items-center justify-center gap-2 border-2 border-[#FB8C00] bg-white text-[#FB8C00] hover:bg-orange-50 font-bold py-3 text-base"
              onClick={handleGoogleLogin}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Login with Google</span>
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-gray-700 hover:text-black underline underline-offset-4"
              >
                Sign In
              </a>
            </div>
          </form>

          {/* Kolom Kanan: Gambar */}
          <div className="relative hidden md:block bg-[#FB8C00] items-center justify-center rounded-r-3xl">
            <img
              src="/images/orange.jpg" // Pastikan gambar ini ada di folder /public
              alt="Athlete"
              className="h-full w-full object-contain rounded-r-3xl"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
