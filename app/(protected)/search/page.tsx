"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSideBar";
import CommitmentCard from "@/components/CommitmentCard";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Get "?q=..." from URL
  
  const [results, setResults] = useState<{ users: any[], commitments: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    async function doSearch() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          setResults(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [query]);

  return (
    <div className="w-full">
      <div className="sticky top-0 bg-[#F7F6F3]/95 backdrop-blur-sm border-b border-[#E1E5EA] px-4 py-4 z-10">
         <h2 className="font-serif font-bold text-xl text-[#2F3E46]">
           Results for "{query}"
         </h2>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#9AA5B1]">Searching Ledger...</div>
      ) : !results || (results.users.length === 0 && results.commitments.length === 0) ? (
        <div className="p-12 text-center text-[#9AA5B1]">No records found.</div>
      ) : (
        <div className="pb-12">
          
          {/* 1. USERS SECTION */}
          {results.users.length > 0 && (
            <div className="p-6 border-b border-[#E1E5EA]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA5B1] mb-4">Accounts</h3>
              <div className="grid gap-4">
                {results.users.map((user) => (
                  <Link key={user.id} href={`/${user.username}`}>
                    <div className="flex items-center gap-3 p-3 bg-white border border-[#E1E5EA] rounded-sm hover:border-[#2F3E46] transition-colors cursor-pointer">
                      <div className="h-10 w-10 bg-[#E1E5EA] text-[#2F3E46] rounded-full flex items-center justify-center font-bold">
                        {user.username.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#1F2933]">{user.username}</p>
                        <p className="text-xs text-[#6B7280]">View Profile</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. COMMITMENTS SECTION */}
          {results.commitments.length > 0 && (
            <div>
              <div className="px-6 pt-6 pb-2">
                 <h3 className="text-xs font-bold uppercase tracking-wider text-[#9AA5B1]">Commitments</h3>
              </div>
              {results.commitments.map((item) => (
                <CommitmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen">
        <Sidebar />
        <main className="flex-1 border-r border-[#E1E5EA] min-w-0">
          {/* Suspense is required when using useSearchParams in Next.js */}
          <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
            <SearchContent />
          </Suspense>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}