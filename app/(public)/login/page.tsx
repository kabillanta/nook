"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Standard Email Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home"); // Firebase handles the rest
    } catch (err: any) {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Login with "Existence Check"
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();

    try {
      // A. Auth with Firebase
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // B. Check Backend: Does this user exist in Postgres?
      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const res = await fetch(`${apiUrl}/users/id/${user.uid}`);

      if (res.ok) {
        // CASE 1: User exists -> Go to Home
        router.push("/home");
      } else {
        // CASE 2: User is new (No Username) -> Send to Signup to finish setup
        // We pass the uid so signup knows to skip the password step
        router.push("/signup?step=username");
      }
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nook-paper flex items-center justify-center p-4 text-[#1F2933]">
      <div className="w-full max-w-md bg-white border border-nook-border p-8 shadow-sm rounded-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-nook-subtle hover:text-[#2F3E46] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <h1 className="font-serif font-bold text-3xl mb-2 text-[#2F3E46]">
          Welcome back.
        </h1>
        <p className="text-[#6B7280] mb-8">Sign in to your ledger.</p>

        {error && (
          <div className="bg-[#BF4343]/10 text-[#BF4343] p-3 text-sm rounded-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nook-subtle mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-nook-paper border border-nook-border p-3 rounded-sm text-[#1F2933] focus:outline-none focus:border-[#2F3E46] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nook-subtle mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-nook-paper border border-nook-border p-3 rounded-sm text-[#1F2933] focus:outline-none focus:border-[#2F3E46] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2F3E46] text-white font-bold py-3 rounded-sm hover:bg-[#1a2429] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-[#E1E5EA] flex-1"></div>
          <span className="text-xs text-nook-subtle uppercase font-bold">OR</span>
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

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          No account?{" "}
          <Link href="/signup" className="text-[#2F3E46] font-bold underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
