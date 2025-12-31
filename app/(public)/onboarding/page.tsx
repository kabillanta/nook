"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Your firebase config
import { Loader2, ArrowRight, User } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // 1. Security Check: Ensure they are logged in via Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login"); 
      } else {
        setInitializing(false); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = auth.currentUser;
    if (!user) return;

    try {
      // 2. The POST Request to create the user in Postgres
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.uid,           // Link Firebase ID
          email: user.email,
          username: username,     // The new input
        }),
      });

      if (res.ok) {
        // Success -> Enter the app
        router.push("/home");
      } else {
        const data = await res.json();
        setError("Username already taken or invalid.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-nook-paper flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2F3E46]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nook-paper flex items-center justify-center p-4 text-[#1F2933]">
      <div className="w-full max-w-md bg-white border border-nook-border p-8 shadow-sm rounded-sm">
        
        {/* Header Section */}
        <div className="mb-8">
            <div className="w-12 h-12 bg-[#2F3E46]/5 rounded-full flex items-center justify-center mb-4">
                <User className="text-[#2F3E46]" size={24} />
            </div>
            <h1 className="font-serif font-bold text-3xl mb-2 text-[#2F3E46]">
            One last step.
            </h1>
            <p className="text-[#6B7280]">
            Choose a callsign. This is how you will be known in the ledger.
            </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#BF4343]/10 text-[#BF4343] p-3 text-sm rounded-sm mb-6 border border-[#BF4343]/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-nook-subtle mb-1">
              Username
            </label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-[#6B7280]">@</span>
                <input
                type="text"
                required
                placeholder="reaper_one"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} // Force lowercase, no spaces
                className="w-full bg-nook-paper border border-nook-border p-3 pl-8 rounded-sm text-[#1F2933] focus:outline-none focus:border-[#2F3E46] transition-colors placeholder:text-[#9CA3AF]"
                />
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
                Visible to everyone. Cannot be changed later.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || username.length < 3}
            className="w-full bg-[#2F3E46] text-white font-bold py-3 rounded-sm hover:bg-[#1a2429] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Enter Protocol <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}