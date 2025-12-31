"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Shield, LogOut } from "lucide-react";
import CommitmentCard from "@/components/CommitmentCard";
import Sidebar from "@/components/Sidebar"; // Make sure this is the UNIFIED component
import RightSidebar from "@/components/RightSideBar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// --- Types ---
interface ProfileData {
  profile: {
    username: string;
    joined_at: string;
    stats: {
      total: number;
      kept: number;
    };
  };
  commitments: Array<any>;
}

export default function ProfilePage() {
  const params = useParams();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${params.username}`
        );
        if (!res.ok) throw new Error("User not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [params.username]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-nook-paper text-nook-subtle">
        Loading...
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-nook-paper text-[#1F2933]">
        <h1 className="font-serif text-3xl mb-2">404</h1>
        <p className="text-[#6B7280]">User not found.</p>
        <Link href="/home" className="mt-4 text-[#2F3E46] underline">
          Return Home
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-nook-paper text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen justify-center lg:justify-start">
        <Sidebar />

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 w-full max-w-2xl border-x-0 md:border-x border-nook-border min-w-0 pb-24 md:pb-0">
          <div className="relative p-6 md:p-8 border-b border-nook-border bg-white">
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="md:hidden absolute top-6 right-6 p-2 text-nook-subtle hover:text-[#BF4343] hover:bg-red-50 rounded-full transition-colors"
              title="Log Out"
            >
              <LogOut size={20} />
            </button>

            {/* Avatar */}
            <div className="mb-4">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-[#2F3E46] text-white rounded-full flex items-center justify-center font-serif text-2xl md:text-3xl font-bold border-4 border-white shadow-sm uppercase">
                {data.profile.username.substring(0, 2)}
              </div>
            </div>

            {/* Name & Handle */}
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1F2933]">
              {data.profile.username}
            </h1>
            <p className="text-[#6B7280] mb-6">@{data.profile.username}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] mb-8">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Calendar size={14} />
                <span>Joined {formatYear(data.profile.joined_at)}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#D4A373]/10 text-[#D4A373] px-3 py-1.5 rounded-full border border-[#D4A373]/20">
                <Shield size={14} />
                <span className="font-bold">
                  {data.profile.stats.kept} Kept Promises
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 md:gap-8 border-b border-nook-border -mx-6 px-6 overflow-x-auto scrollbar-hide">
              <div className="pb-3 border-b-2 border-[#2F3E46] font-bold text-[#1F2933] cursor-pointer whitespace-nowrap">
                Records
              </div>
              <div className="pb-3 border-b-2 border-transparent text-nook-subtle hover:text-[#1F2933] cursor-pointer transition-colors whitespace-nowrap">
                Pending
              </div>
              <div className="pb-3 border-b-2 border-transparent text-nook-subtle hover:text-[#1F2933] cursor-pointer transition-colors whitespace-nowrap">
                Archived
              </div>
            </div>
          </div>

          {/* --- COMMITMENTS LIST --- */}
          <div className="w-full">
            {data.commitments.length === 0 ? (
              <div className="p-12 text-center text-nook-subtle italic">
                This user has no public record.
              </div>
            ) : (
              data.commitments.map((item) => (
                <CommitmentCard key={item.id} item={item} />
              ))
            )}

            <div className="py-12 text-center text-nook-subtle text-sm italic">
              End of ledger.
            </div>
          </div>
        </main>

        {/* --- DESKTOP RIGHT SIDEBAR --- */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
