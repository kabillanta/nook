"use client";

import { Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const router = useRouter();
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Get the values directly from the form inputs
    // (Ensure your inputs have name="username", name="email", etc.)
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      // --- STEP A: Call your Python Backend ---
      // This validates the data, creates the account in Firebase, AND saves to Postgres.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If backend says "Handle taken" or "Email exists", throw that error
        throw new Error(data.detail || "Registration failed");
      }

      // --- STEP B: Sign In ---
      // The account now exists! We just need to log the browser in.
      await signInWithEmailAndPassword(auth, email, password);

      // --- STEP C: Redirect to their new Profile ---
      router.push(`/${username}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 1. Check if user exists in YOUR Postgres DB
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/id/${user.uid}`);

      if (res.status === 200) {
        // CASE: User exists -> Go to Dashboard
        router.push("/dashboard"); // or "/"
      } else {
        // CASE: New User -> Go to Onboarding to set username
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nook-paper p-6 text-[#1F2933]">
      <Link
        href="/"
        className="mb-8 font-serif font-bold text-3xl text-[#2F3E46]"
      >
        Nook.
      </Link>

      <div className="w-full max-w-md bg-white border border-nook-border shadow-sm p-8 rounded-sm">
        <h1 className="font-serif text-2xl font-bold text-[#1F2933] mb-2">
          Initialize Identity
        </h1>
        <p className="text-[#6B7280] text-sm mb-8">
          Create a permanent handle. Your reputation starts at zero.
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Handle (Username) */}
          <div className="space-y-2">
            <label
              className="text-xs font-bold uppercase tracking-wider text-[#4B5563]"
              htmlFor="username"
            >
              Claim Handle
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nook-subtle" />
              <input
                id="username"
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border border-nook-border rounded-sm focus:outline-none focus:border-[#2F3E46] focus:ring-1 focus:ring-[#2F3E46] transition-all bg-[#F9FAFB] text-sm"
                placeholder="e.g. alex_c"
              />
            </div>
            <p className="text-[10px] text-nook-subtle">
              This will be your public identifier forever.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              className="text-xs font-bold uppercase tracking-wider text-[#4B5563]"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nook-subtle" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-nook-border rounded-sm focus:outline-none focus:border-[#2F3E46] focus:ring-1 focus:ring-[#2F3E46] transition-all bg-[#F9FAFB] text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              className="text-xs font-bold uppercase tracking-wider text-[#4B5563]"
              htmlFor="password"
            >
              Set Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nook-subtle" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-nook-border rounded-sm focus:outline-none focus:border-[#2F3E46] focus:ring-1 focus:ring-[#2F3E46] transition-all bg-[#F9FAFB] text-sm"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <div className="mt-1">
              <input
                type="checkbox"
                className="accent-[#2F3E46] w-4 h-4 cursor-pointer"
                id="terms"
              />
            </div>
            <label
              htmlFor="terms"
              className="text-xs text-[#6B7280] leading-relaxed cursor-pointer select-none"
            >
              I understand that commitments made on Nook cannot be edited or
              deleted once published.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D4A373] text-white font-medium py-3 rounded-sm hover:bg-[#c69260] transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
          >
            Create Account
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>
        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-[#E1E5EA] flex-1"></div>
          <span className="text-xs text-nook-subtle uppercase font-bold">
            OR
          </span>
          <div className="h-px bg-[#E1E5EA] flex-1"></div>
        </div>

        {/* --- GOOGLE LOGIN BUTTON --- */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white border border-nook-border text-[#1F2933] font-bold py-3 rounded-sm hover:bg-nook-paper transition-all flex items-center justify-center gap-2"
        >
          {/* Simple Google G Logo SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
        <div className="mt-8 text-center border-t border-nook-border pt-6">
          <p className="text-sm text-[#6B7280]">
            Already have a handle?
            <Link
              href="/login"
              className="text-[#2F3E46] font-bold hover:underline"
            >
              Sign In.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
