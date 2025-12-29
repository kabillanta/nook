import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar"; // Client Component
import Feed from "@/components/Feed";       // Server Component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen">

        {/* --- 1. Client Sidebar (Loads User Logic) --- */}
        <Sidebar />

        {/* --- 2. Server Feed (Loads Instantly) --- */}
        <main className="flex-1 border-r border-[#E1E5EA] min-w-0">
          <div className="sticky top-0 bg-[#F7F6F3]/95 backdrop-blur-sm border-b border-[#E1E5EA] px-4 py-4 z-10 flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl">Public Record</h2>
          </div>
          
          {/* This part arrives pre-rendered from the server */}
          <Feed />
        </main>

        {/* --- 3. Static Right Sidebar --- */}
        <aside className="w-[350px] hidden lg:block px-8 py-8 h-screen sticky top-0 flex-shrink-0">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-3.5 text-[#9AA5B1]" size={18} />
            <input type="text" placeholder="Search the ledger..." className="w-full bg-white border border-[#E1E5EA] rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2F3E46] transition-colors shadow-sm" />
          </div>
          <div className="bg-white border border-[#E1E5EA] rounded-sm p-5 mb-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-4 text-[#2F3E46]">High Stakes</h3>
            <div className="text-sm text-[#6B7280] italic">Trending topics loading...</div>
          </div>
          <div className="text-xs text-[#9AA5B1] leading-relaxed px-2">
            <p className="mb-2">Nook is an immutable public ledger.</p>
            <span>© 2024 Nook Inc.</span>
          </div>
        </aside>

      </div>
    </div>
  );
}