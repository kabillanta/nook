"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function CreatePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // 1. Ensure user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Handle Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text || !date || !time) return;

    setLoading(true);

    const deadlineISO = new Date(`${date}T${time}`).toISOString();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commitments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: uid, 
          text: text,
          deadline: deadlineISO,
        }),
      });

      if (!res.ok) throw new Error("Failed to seal commitment");
      router.push("/home");
    } catch (err) {
      alert("System Error: Could not seal commitment.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-nook-paper text-[#1F2933] flex flex-col items-center pt-20 px-6">
      {/* --- Close Button --- */}
      <Link
        href="/home"
        className="absolute top-8 right-8 p-2 hover:bg-[#E1E5EA] rounded-full transition-colors text-[#6B7280]"
      >
        <X size={24} />
      </Link>

      {/* --- The Contract Form --- */}
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="font-serif font-bold text-4xl mb-2 text-[#2F3E46]">
          Declare Intent.
        </h1>
        <p className="text-[#6B7280] mb-10">
          This record will be immutable and public.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. The Promise */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-nook-subtle">
              I commit to...
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. ship the beta version by Friday..."
              className="w-full bg-transparent text-3xl font-serif text-[#1F2933] placeholder:text-[#E1E5EA] border-b-2 border-nook-border focus:border-[#2F3E46] focus:outline-none py-2 resize-none leading-normal h-32 transition-colors"
              autoFocus
            />
          </div>

          {/* 2. The Deadline (The Reaper) */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-nook-subtle flex items-center gap-2">
                <Calendar size={14} /> Deadline Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-nook-border p-4 rounded-sm font-medium text-[#1F2933] focus:outline-none focus:border-[#2F3E46] transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-nook-subtle flex items-center gap-2">
                <Clock size={14} /> Deadline Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-nook-border p-4 rounded-sm font-medium text-[#1F2933] focus:outline-none focus:border-[#2F3E46] transition-colors"
              />
            </div>
          </div>

          {/* 3. The Warning & Button */}
          <div className="pt-8 flex items-center justify-between border-t border-nook-border">
            <div className="flex items-center gap-3 text-[#D4A373] text-sm max-w-xs">
              <AlertTriangle size={20} className="flex-shrink-0" />
              <p className="leading-tight">
                Once sealed, this commitment cannot be edited or deleted.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !text || !date || !time}
              className="bg-[#2F3E46] text-white px-8 py-4 font-bold text-lg rounded-sm hover:bg-[#1a2429] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
            >
              {loading ? "Sealing..." : "Seal Commitment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
