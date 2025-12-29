"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, Plus, LogOut, Search } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch username in background (doesn't block the page load)
        try {
          const res = await fetch(`http://127.0.0.1:8000/users/id/${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUsername(data.username);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-[80px] xl:w-[275px] sticky top-0 h-screen flex flex-col border-r border-[#E1E5EA] px-2 xl:px-6 py-8 items-center xl:items-start transition-all">
      <Link href="/home" className="mb-12 block">
        <h1 className="font-serif font-bold text-3xl text-[#2F3E46] hidden xl:block">Nook.</h1>
        <h1 className="font-serif font-bold text-3xl text-[#2F3E46] xl:hidden">N.</h1>
      </Link>

      <nav className="flex-1 space-y-4 w-full">
        <NavItem icon={<Home size={26} />} text="Registry" href="/home" active />
        <NavItem icon={<Search size={26} />} text="Explore" href="/explore" />
        <NavItem icon={<User size={26} />} text="Profile" href={username ? `/${username}` : "#"} />
      </nav>

      <Link href="/create" className="w-12 h-12 xl:w-full bg-[#2F3E46] hover:bg-[#1a2429] text-white font-bold rounded-full xl:rounded-sm shadow-sm transition-colors mb-6 flex items-center justify-center gap-2">
        <Plus size={24} />
        <span className="hidden xl:inline text-lg">Declare</span>
      </Link>

      {/* User Profile - Loads smoothly */}
      <div onClick={handleLogout} className="flex items-center gap-3 p-2 xl:p-3 hover:bg-[#E1E5EA]/50 rounded-full xl:rounded-sm cursor-pointer transition-colors mt-auto w-full justify-center xl:justify-start group">
        <div className="h-10 w-10 bg-[#D4A373] text-white rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm uppercase">
          {username ? username.substring(0, 2) : "?"}
        </div>
        <div className="hidden xl:block flex-1 leading-none overflow-hidden">
          <p className="font-bold text-sm truncate">{username || "Loading..."}</p>
          <p className="text-xs text-[#6B7280]">Sign Out</p>
        </div>
        <LogOut size={20} className="text-[#9AA5B1] hidden xl:block group-hover:text-[#BF4343] transition-colors" />
      </div>
    </aside>
  );
}

function NavItem({ icon, text, href, active }: any) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 px-4 xl:px-4 py-3 rounded-full xl:rounded-full cursor-pointer transition-colors text-xl justify-center xl:justify-start ${active ? 'font-bold text-[#2F3E46]' : 'text-[#1F2933] hover:bg-[#E1E5EA]/50'}`}>
        {icon} <span className="hidden xl:inline">{text}</span>
      </div>
    </Link>
  );
}