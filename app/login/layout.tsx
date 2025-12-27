import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F6F3] p-6 text-[#1F2933]">
      
      {/* Brand Header */}
      <Link href="/" className="mb-8 font-serif font-bold text-3xl text-[#2F3E46]">
        Nook.
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-[#E1E5EA] shadow-sm p-8 rounded-sm">
        <h1 className="font-serif text-2xl font-bold text-[#1F2933] mb-2">Access the Registry</h1>
        <p className="text-[#6B7280] text-sm mb-8">
          Enter your credentials to view or update your commitments.
        </p>

        <form className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563]" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA5B1]" />
              <input 
                id="email" 
                type="email" 
                className="w-full pl-10 pr-4 py-2.5 border border-[#E1E5EA] rounded-sm focus:outline-none focus:border-[#2F3E46] focus:ring-1 focus:ring-[#2F3E46] transition-all bg-[#F9FAFB] text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4B5563]" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#2F3E46] hover:underline">
                Lost key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA5B1]" />
              <input 
                id="password" 
                type="password" 
                className="w-full pl-10 pr-4 py-2.5 border border-[#E1E5EA] rounded-sm focus:outline-none focus:border-[#2F3E46] focus:ring-1 focus:ring-[#2F3E46] transition-all bg-[#F9FAFB] text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#2F3E46] text-white font-medium py-3 rounded-sm hover:bg-[#1a2429] transition-colors flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* --- DIVIDER --- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E1E5EA]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-[#9AA5B1]">Or continue with</span>
          </div>
        </div>

        {/* --- GOOGLE BUTTON --- */}
        <button 
          type="button"
          className="w-full bg-white border border-[#E1E5EA] text-[#1F2933] font-medium py-2.5 rounded-sm hover:bg-[#F7F6F3] transition-colors flex items-center justify-center gap-3"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[#E1E5EA] pt-6">
          <p className="text-sm text-[#6B7280]">
            No record yet?{' '}
            <Link href="/signup" className="text-[#2F3E46] font-bold hover:underline">
              Initialize identity.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}