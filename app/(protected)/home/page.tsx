import { Search } from "lucide-react";
import Sidebar from "@/components/Sidebar"; // Client Component
import Feed from "@/components/Feed";       // Server Component
import RightSidebar from "@/components/RightSideBar";

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
        <RightSidebar />

      </div>
    </div>
  );
}