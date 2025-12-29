"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // To get the [username] from URL
import { 
  Home, User, Plus, LogOut, Search, MoreHorizontal, 
  CheckCircle2, XCircle, Clock, Eye, Calendar, Shield
} from "lucide-react";

// --- Types ---
interface ProfileData {
  profile: {
    username: string;
    joined_at: string;
    stats: {
      total: number;
      kept: number;
    }
  };
  commitments: Array<{
    id: number;
    text: string;
    status: string;
    deadline: string;
    witness_count: number;
    created_at: string;
  }>;
}

export default function ProfilePage() {
  const params = useParams(); // Get the username from the URL
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${params.username}`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] text-[#9AA5B1]">Loading Record...</div>;
  
  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F6F3] text-[#1F2933]">
      <h1 className="font-serif text-3xl mb-2">404</h1>
      <p className="text-[#6B7280]">User record not found.</p>
      <Link href="/home" className="mt-4 text-[#2F3E46] underline">Return Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen">

        {/* --- LEFT SIDEBAR (Same as Home) --- */}
        <aside className="w-[80px] xl:w-[275px] sticky top-0 h-screen flex flex-col border-r border-[#E1E5EA] px-2 xl:px-6 py-8 items-center xl:items-start transition-all">
          <Link href="/home" className="mb-12 block">
            <h1 className="font-serif font-bold text-3xl text-[#2F3E46] hidden xl:block">Nook.</h1>
            <h1 className="font-serif font-bold text-3xl text-[#2F3E46] xl:hidden">N.</h1>
          </Link>
          <nav className="flex-1 space-y-4 w-full">
            <NavItem icon={<Home size={26} />} text="Registry" href="/home" />
            <NavItem icon={<Search size={26} />} text="Explore" href="/explore" />
            <NavItem icon={<User size={26} />} text="Profile" href={`/${data.profile.username}`} active />
          </nav>
          <Link href="/create" className="w-12 h-12 xl:w-full bg-[#2F3E46] hover:bg-[#1a2429] text-white font-bold rounded-full xl:rounded-sm shadow-sm transition-colors mb-6 flex items-center justify-center gap-2">
            <Plus size={24} />
            <span className="hidden xl:inline text-lg">Declare</span>
          </Link>
        </aside>

        {/* --- CENTER PROFILE --- */}
        <main className="flex-1 border-r border-[#E1E5EA] min-w-0">
          
          {/* Header Bar */}
          <div className="sticky top-0 bg-[#F7F6F3]/95 backdrop-blur-sm border-b border-[#E1E5EA] px-4 py-3 z-10 flex items-center gap-4">
             <Link href="/home" className="lg:hidden text-[#9AA5B1]"><Home size={20}/></Link>
             <div>
                <h2 className="font-bold text-lg leading-none">{data.profile.username}</h2>
                <span className="text-xs text-[#6B7280]">{data.profile.stats.total} commitments</span>
             </div>
          </div>

          {/* Profile Hero */}
          <div className="p-6 border-b border-[#E1E5EA] bg-white">
             {/* Avatar Area */}
             <div className="flex justify-between items-start mb-4">
               <div className="h-24 w-24 bg-[#2F3E46] text-white rounded-full flex items-center justify-center font-serif text-3xl font-bold border-4 border-white shadow-sm">
                 {data.profile.username.substring(0, 2).toUpperCase()}
               </div>
               {/* Could add 'Edit Profile' or 'Follow' button here */}
             </div>

             {/* Names */}
             <h1 className="font-serif font-bold text-2xl text-[#1F2933]">{data.profile.username}</h1>
             <p className="text-[#6B7280] mb-4">@{data.profile.username}</p>

             {/* Metadata */}
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

             {/* Tabs (Visual only for now) */}
             <div className="flex gap-8 border-b border-[#E1E5EA] -mx-6 px-6">
                <div className="pb-3 border-b-2 border-[#2F3E46] font-bold text-[#1F2933] cursor-pointer">Records</div>
                <div className="pb-3 border-b-2 border-transparent text-[#9AA5B1] hover:text-[#1F2933] cursor-pointer transition-colors">Pending</div>
                <div className="pb-3 border-b-2 border-transparent text-[#9AA5B1] hover:text-[#1F2933] cursor-pointer transition-colors">Archived</div>
             </div>
          </div>

          {/* Commitments List */}
          <div className="w-full">
            {data.commitments.length === 0 ? (
               <div className="p-12 text-center text-[#9AA5B1] italic">
                 This user has no public record.
               </div>
            ) : (
              data.commitments.map((item) => (
                <div key={item.id} className="p-6 border-b border-[#E1E5EA] hover:bg-white transition-colors cursor-pointer group">
                  {/* Status Label (Top Right) */}
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs text-[#9AA5B1] uppercase tracking-wider font-bold">
                       {formatDate(item.created_at)}
                     </span>
                     <MoreHorizontal size={16} className="text-[#9AA5B1] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="mb-4 text-lg leading-relaxed text-[#1F2933] font-serif">
                    {item.text}
                  </p>

                  <div className="flex items-center justify-between">
                    <StatusBadge 
                      color={item.status === 'pending' ? "text-[#D4A373]" : item.status === 'kept' ? "text-[#5C7F67]" : "text-[#8C4A4A]"}
                      icon={item.status === 'pending' ? <Clock size={14} /> : item.status === 'kept' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      text={item.status === 'pending' ? `Due: ${formatDate(item.deadline)}` : item.status === 'kept' ? "Kept" : "Broken"}
                    />
                    <div className="flex items-center gap-1.5 text-[#9AA5B1] text-xs">
                       <Eye size={16} />
                       <span>{item.witness_count}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
             <div className="py-12 text-center text-[#9AA5B1] text-sm italic">
              End of ledger.
            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR (Widgets) --- */}
        <aside className="w-[350px] hidden lg:block px-8 py-8 h-screen sticky top-0 flex-shrink-0">
          <div className="bg-white border border-[#E1E5EA] rounded-sm p-5 mb-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-2 text-[#2F3E46]">Identity Proof</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              This record is permanently linked to <strong>@{data.profile.username}</strong>. 
              Changes to the ledger are immutable.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- Sub-Components ---
function NavItem({ icon, text, href, active = false }: { icon: any, text: string, href: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-4 xl:px-4 py-3 rounded-full xl:rounded-full cursor-pointer transition-colors text-xl justify-center xl:justify-start ${active ? 'font-bold text-[#2F3E46]' : 'text-[#1F2933] hover:bg-[#E1E5EA]/50'}`}>
        {icon} <span className="hidden xl:inline">{text}</span>
      </div>
    </Link>
  );
}

function StatusBadge({ color, icon, text }: { color: string, icon: any, text: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${color} bg-opacity-10 px-2 py-1 rounded-sm`}>
      {icon} <span className="text-xs font-bold uppercase tracking-wider">{text}</span>
    </div>
  );
}