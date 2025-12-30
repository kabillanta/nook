"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Home, User, Plus, Search, Calendar, Shield } from "lucide-react";
import CommitmentCard from "@/components/CommitmentCard"; // <--- IMPORT THIS
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSideBar";

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
  commitments: Array<any>; // reusing the type from card
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
          `http://127.0.0.1:8000/users/${params.username}`
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

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-nook-paper text-nook-subtle">
        Loading Record...
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-nook-paper text-[#1F2933]">
        <h1 className="font-serif text-3xl mb-2">404</h1>
        <p className="text-[#6B7280]">User record not found.</p>
        <Link href="/home" className="mt-4 text-[#2F3E46] underline">
          Return Home
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-nook-paper text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen">
        {/* --- LEFT SIDEBAR --- */}
        <Sidebar />

        {/* --- CENTER PROFILE --- */}
        <main className="flex-1 border-r border-nook-border min-w-0">
          {/* Header Bar */}
          <div className="sticky top-0 bg-nook-paper/95 backdrop-blur-sm border-b border-nook-border px-4 py-3 z-10 flex items-center gap-4">
            <Link href="/home" className="lg:hidden text-nook-subtle">
              <Home size={20} />
            </Link>
            <div>
              <h2 className="font-bold text-lg leading-none">
                {data.profile.username}
              </h2>
              <span className="text-xs text-[#6B7280]">
                {data.profile.stats.total} commitments
              </span>
            </div>
          </div>

          {/* Profile Hero */}
          <div className="p-6 border-b border-nook-border bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="h-24 w-24 bg-[#2F3E46] text-white rounded-full flex items-center justify-center font-serif text-3xl font-bold border-4 border-white shadow-sm uppercase">
                {data.profile.username.substring(0, 2)}
              </div>
            </div>

            <h1 className="font-serif font-bold text-2xl text-[#1F2933]">
              {data.profile.username}
            </h1>
            <p className="text-[#6B7280] mb-4">@{data.profile.username}</p>

            <div className="flex gap-4 text-sm text-[#6B7280] mb-6">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Joined {formatYear(data.profile.joined_at)}</span>
              </div>
              <div className="flex items-center gap-1 text-[#D4A373]">
                <Shield size={14} />
                <span>Reputation: {data.profile.stats.kept} Kept</span>
              </div>
            </div>

            <div className="flex gap-8 border-b border-nook-border -mx-6 px-6">
              <div className="pb-3 border-b-2 border-[#2F3E46] font-bold text-[#1F2933] cursor-pointer">
                Records
              </div>
              <div className="pb-3 border-b-2 border-transparent text-nook-subtle hover:text-[#1F2933] cursor-pointer transition-colors">
                Pending
              </div>
              <div className="pb-3 border-b-2 border-transparent text-nook-subtle hover:text-[#1F2933] cursor-pointer transition-colors">
                Archived
              </div>
            </div>
          </div>

          {/* Commitments List (Using Component) */}
          <div className="w-full">
            {data.commitments.length === 0 ? (
              <div className="p-12 text-center text-nook-subtle italic">
                This user has no public record.
              </div>
            ) : (
              data.commitments.map((item) => (
                // We pass the item to the smart component
                <CommitmentCard key={item.id} item={item} />
              ))
            )}

            <div className="py-12 text-center text-nook-subtle text-sm italic">
              End of ledger.
            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR --- */}
        <RightSidebar />
      </div>
    </div>
  );
}

function NavItem({
  icon,
  text,
  href,
  active = false,
}: {
  icon: any;
  text: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-4 px-4 xl:px-4 py-3 rounded-full xl:rounded-full cursor-pointer transition-colors text-xl justify-center xl:justify-start ${
          active
            ? "font-bold text-[#2F3E46]"
            : "text-[#1F2933] hover:bg-[#E1E5EA]/50"
        }`}
      >
        {icon} <span className="hidden xl:inline">{text}</span>
      </div>
    </Link>
  );
}
