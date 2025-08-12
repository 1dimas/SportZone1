import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10  bg-muted  transition-colors hover:bg-[#1F2937]  ">
      <div className="w-full max-w-sm md:max-w-3xl ">
        <LoginForm />
      </div>
    </div>
  )
}
