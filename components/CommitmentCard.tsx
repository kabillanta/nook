"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  Share2,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useInView } from "react-intersection-observer"; // <--- 1. Import this

export default function CommitmentCard({ item }: { item: any }) {
  const [status, setStatus] = useState(item.status);
  const [witnessCount, setWitnessCount] = useState(item.witness_count); // Local state for immediate update
  const [isMyCommitment, setIsMyCommitment] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
    delay: 500, 
  });

  useEffect(() => {
    if (inView) {
      // Fire and forget (don't wait for response)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/commitments/${item.id}/witness`, {
        method: "POST",
      });
      // Optimistically update the UI to show the view happening
      setWitnessCount((prev: number) => prev + 1);
    }
  }, [inView, item.id]);
  // ---------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === item.owner.id) {
        setIsMyCommitment(true);
        setCurrentUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, [item.owner.id]);

  async function handleComplete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Confirm you have kept this commitment?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/commitments/${item.id}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUid,
            proof: "Manual verification",
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail);
        return;
      }
      setStatus("kept");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/${item.owner.username}`;
    const text = `I just bet my reputation on Nook.\n\n"${item.text}"\n\nWitness me: ${url}`;

    // Try native share (Mobile), fallback to Clipboard (Desktop)
    if (navigator.share) {
      navigator.share({ title: "Nook Protocol", text: text, url: url });
    } else {
      navigator.clipboard.writeText(text);
      alert("Link copied to clipboard. Go make it public.");
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    // Attach the 'ref' here so the observer watches this div
    <div
      ref={ref}
      className="p-4 sm:p-6 border-b border-nook-border hover:bg-white transition-colors group"
    >
      <div className="flex gap-4">
        <Link
          href={`/${item.owner.username}`}
          className="h-10 w-10 sm:h-12 sm:w-12 bg-[#E1E5EA] text-[#2F3E46] rounded-full flex-shrink-0 flex items-center justify-center font-serif font-bold text-lg uppercase hover:bg-[#D4A373] hover:text-white transition-colors"
        >
          {item.owner.username.substring(0, 2)}
        </Link>

        <div className="flex-1 min-w-0">
          {/* --- HEADER --- */}
          <div className="flex justify-between items-start">
            <Link
              href={`/${item.owner.username}`}
              className="flex items-center gap-2 truncate hover:underline decoration-[#9AA5B1]"
            >
              <span className="font-bold text-[#1F2933] truncate">
                {item.owner.username}
              </span>
              <span className="text-nook-subtle text-sm truncate">
                @{item.owner.username}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {/* SHARE BUTTON */}
              <button
                onClick={handleShare}
                className="text-nook-subtle hover:text-[#2F3E46] transition-colors p-1"
                title="Share to Public"
              >
                <Share2 size={16} />
              </button>

              {/* EXISTING BUTTON LOGIC */}
              {status === "pending" && isMyCommitment ? (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-[#2F3E46] text-white px-3 py-1.5 rounded-sm text-xs font-bold hover:bg-[#1a2429] transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                >
                  {loading ? "Verifying..." : "Mark Kept"}
                  <Check size={14} />
                </button>
              ) : (
                // ... existing MoreHorizontal logic ...
                <MoreHorizontal
                  size={16}
                  className="text-nook-subtle flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          </div>

          <p className="mt-2 mb-3 text-[17px] leading-relaxed text-[#1F2933] font-serif break-words">
            {item.text}
          </p>

          <div className="flex flex-wrap gap-y-2 items-center justify-between mt-3">
            <div
              className={`flex items-center gap-1.5 ${
                status === "pending"
                  ? "text-[#D4A373]"
                  : status === "kept"
                  ? "text-[#5C7F67]"
                  : "text-[#8C4A4A]"
              } bg-opacity-10 px-2 py-1 rounded-sm`}
            >
              {status === "pending" ? (
                <Clock size={14} />
              ) : status === "kept" ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                {status === "pending"
                  ? `Due: ${formatDate(item.deadline)}`
                  : status === "kept"
                  ? "Kept"
                  : "Broken"}
              </span>
            </div>

            {/* The Eye Counter */}
            <div className="flex items-center gap-1.5 text-nook-subtle text-xs group-hover:text-[#2F3E46] transition-colors ml-auto">
              <Eye size={16} />
              {/* Use the local state variable here */}
              <span>{witnessCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
