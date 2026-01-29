import { RegisterForm } from "@/components/register-form";


export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Dynamic Background */}


      <div className="w-full max-w-4xl relative z-10">
        <RegisterForm />
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} SportZone. Hak Cipta Dilindungi.
      </div>
    </div>
  )
}
