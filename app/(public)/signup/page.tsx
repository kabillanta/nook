"use client";

import { Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

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
      const res = await fetch("http://127.0.0.1:8000/register", {
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
    }
  }

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

        <div className="mt-8 text-center border-t border-nook-border pt-6">
          <p className="text-sm text-[#6B7280]">
            Already have a handle?{" "}
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
