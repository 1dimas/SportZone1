"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, getProfile, API_URL } from "./lib/services/auth.service";
import { IconEye, IconEyeOff, IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Reset error animation state when user types
  useEffect(() => {
    if (isError) setIsError(false);
  }, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      const res = await login(email, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);

        const profile = await getProfile();
        
        toast.success(`Welcome back, ${profile?.username || 'User'}!`);

        if (profile?.role?.name === "admin") {
          router.push("/dashboardadmin");
        } else if (profile?.role?.name === "petugas") {
          router.push("/dashboardpetugas");
        } else {
          router.push("/home");
        }
      } else {
        setIsError(true);
        toast.error("Login gagal. Cek email/password.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      toast.error("Email atau password salah");
    } finally {
      setLoading(false);
    }
  }

  // Google login
  function handleGoogleLogin() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = `${API_URL}/auth/google`;
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className={cn(
        "bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in-95 duration-500",
        isError && "animate-shake ring-2 ring-red-500/50"
      )}>
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Welcome back! 👋
                </h1>
                <p className="text-gray-500 text-sm">
                  Enter your details to access your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 group">
                  <Label htmlFor="email" className="font-medium text-gray-700 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col gap-2 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-medium text-gray-700 ml-1">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <IconEyeOff className="size-5" />
                      ) : (
                        <IconEye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-sm hover:shadow-md active:scale-95 transform transition-all duration-200 mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="relative flex items-center gap-4 py-2">
                <span className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Or continue with</span>
                <span className="h-px bg-gray-200 flex-1" />
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                className="h-12 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700 font-bold flex items-center justify-center gap-3 active:scale-95 transition-all duration-200 group"
              >
                <IconBrandGoogle className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <span>Google Account</span>
              </Button>

              <div className="text-center">
                <p className="text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Decoration */}
          <div className="hidden md:block relative bg-orange-50/50 overflow-hidden border-l border-gray-100">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Background Loop */}
            

              {/* Foreground Image */}
              <div className="relative z-10 w-64 h-64 opacity-20 grayscale transition-all duration-700 hover:opacity-40 hover:grayscale-0 hover:scale-110">
                 <img src="/images/logo2.png" alt="SportZone Watermark" className="w-full h-full object-contain" />
              </div>
            </div>
            
            {/* Abstract Shapes */}
             <div className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-orange-400/20 blur-sm" />
             <div className="absolute bottom-1/3 right-10 w-6 h-6 rounded-full bg-red-400/10 blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
