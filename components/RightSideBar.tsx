"use client";

import { useState, useEffect } from "react";
import { Search, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import Router

export default function RightSidebar() {
  const [trending, setTrending] = useState([]);
  const [query, setQuery] = useState(""); // 2. State for input
  const router = useRouter();

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/explore");
        if (res.ok) {
          const data = await res.json();
          setTrending(data.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to load trending", e);
      }
    }
    fetchTrending();
  }, []);

  // 3. Handle Enter Key
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <aside className="w-[350px] hidden lg:block px-8 py-8 h-screen sticky top-0 flex-shrink-0 border-l border-nook-border">
      
      {/* Functional Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-nook-subtle" size={18} />
        <input 
          type="text" 
          placeholder="Search the ledger..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch} // Listen for Enter
          className="w-full bg-white border border-nook-border rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2F3E46] transition-colors shadow-sm"
        />
      </div>

      {/* ... (Rest of the component remains the same) ... */}
      <div className="bg-white border border-nook-border rounded-sm p-5 mb-6 shadow-sm">
        <h3 className="font-serif font-bold text-lg mb-4 text-[#2F3E46] flex items-center gap-2">
          <Flame size={18} className="text-[#D4A373]" />
          High Stakes
        </h3>
        
        <div className="space-y-4">
          {trending.length === 0 ? (
            <p className="text-sm text-nook-subtle italic">No data available.</p>
          ) : (
            trending.map((item: any) => (
              <Link key={item.id} href={`/${item.owner.username}`}>
                <div className="cursor-pointer hover:bg-nook-paper p-2 -mx-2 rounded-sm transition-colors group">
                  <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                    <span className="font-bold text-[#2F3E46]">@{item.owner.username}</span>
                    <span>{item.witness_count} witnesses</span>
                  </div>
                  <p className="font-serif text-[#1F2933] text-sm line-clamp-2 leading-relaxed group-hover:underline decoration-[#9AA5B1]">
                    {item.text}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        <Link href="/explore" className="mt-4 pt-4 border-t border-nook-border text-[#D4A373] text-sm hover:text-[#2F3E46] flex items-center gap-1 transition-colors">
          View all high stakes <ArrowRight size={14} />
        </Link>
      </div>

      <div className="text-xs text-nook-subtle leading-relaxed px-2">
        <p className="mb-2">
          Nook is an immutable public ledger. <br/> Your reputation is your currency.
        </p>
        <div className="flex gap-2 flex-wrap">
          <span>© 2024 Nook Inc.</span>
        </div>
      </div>

    </aside>
  );
}