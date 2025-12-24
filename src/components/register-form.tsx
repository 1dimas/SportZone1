"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register, API_URL } from "./lib/services/auth.service";
import { IconEye, IconEyeOff, IconBrandGoogle, IconUser, IconMail, IconPhone, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 5) score += 1;
    if (password.length > 7) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  // Reset error state on typing
  useEffect(() => {
    if (isError) setIsError(false);
  }, [name, email, phone, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      const res = await register(name, email, phone, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        toast.success("Account created successfully!");
        router.push("/home");
      } else {
        setIsError(true);
        router.push("/login"); // Fallback logic from original code, maybe should stay on page? keeping as is.
      }
    } catch (err: unknown) {
      console.error(err);
      setIsError(true);
      toast.error("Registration failed. Please try again.");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className={cn(
        "bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in-95 duration-500",
        isError && "animate-shake ring-2 ring-red-500/50"
      )}>
        <div className="grid md:grid-cols-2 min-h-[600px]">
          
          {/* Left Side - Image/Decoration */}
          <div className="hidden md:block relative bg-orange-50/50 overflow-hidden order-2 md:order-1 border-r border-gray-100">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
               {/* Background Loop */}
              

              {/* Foreground Image */}
              <div className="relative z-10 w-64 h-64 opacity-20 grayscale transition-all duration-700 hover:opacity-40 hover:grayscale-0 hover:scale-110">
                 <img src="/images/logo2.png" alt="SportZone Watermark" className="w-full h-full object-contain" />
              </div>
            </div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-1/3 right-10 w-4 h-4 rounded-full bg-orange-400/20 blur-sm" />
            <div className="absolute bottom-1/4 left-10 w-6 h-6 rounded-full bg-red-400/10 blur-sm" />
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative order-1 md:order-2">
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Get Started Free
                </h1>
                <p className="text-gray-500 text-sm">
                  Join thousands of sports enthusiasts today.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2 group">
                    <Label htmlFor="name" className="font-medium text-gray-700 ml-1">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pl-11"
                      />
                      <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2 group">
                    <Label htmlFor="phone" className="font-medium text-gray-700 ml-1">Phone</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0812..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pl-11"
                      />
                      <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2 group">
                  <Label htmlFor="email" className="font-medium text-gray-700 ml-1">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pl-11"
                    />
                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 group">
                  <Label htmlFor="password" className="font-medium text-gray-700 ml-1">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a strong password"
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 pl-11 pr-12"
                    />
                     <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
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
                  
                  {/* Password Strength Meter */}
                  {password && (
                    <div className="flex items-center gap-2 mt-1 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500 ease-out",
                            passwordStrength <= 1 ? "w-1/4 bg-red-500" :
                            passwordStrength <= 2 ? "w-2/4 bg-orange-500" :
                            passwordStrength <= 3 ? "w-3/4 bg-yellow-400" :
                            "w-full bg-green-500"
                          )} 
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-md",
                        passwordStrength <= 1 ? "text-red-500 bg-red-50" :
                        passwordStrength <= 2 ? "text-orange-500 bg-orange-50" :
                        passwordStrength <= 3 ? "text-yellow-600 bg-yellow-50" :
                        "text-green-600 bg-green-50"
                      )}>
                        {passwordStrength <= 1 ? "Weak" :
                         passwordStrength <= 2 ? "Fair" :
                         passwordStrength <= 3 ? "Good" : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-sm hover:shadow-md active:scale-95 transform transition-all duration-200 mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="relative flex items-center gap-4 py-2">
                <span className="h-px bg-gray-200 flex-1" />
                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Or register with</span>
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
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
