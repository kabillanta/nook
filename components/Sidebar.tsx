"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, User, Plus, Search, LogOut, PlusSquare } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/id/${user.uid}`
          );
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

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* --- DESKTOP VIEW (Vertical Left) --- */}
      <aside className="hidden md:flex w-20 xl:w-64 sticky top-0 h-screen flex-col border-r border-nook-border px-2 xl:px-6 py-8 items-center xl:items-start transition-all bg-nook-paper z-20">
        <Link href="/home" className="mb-12 block">
          <h1 className="font-serif font-bold text-3xl text-[#2F3E46] hidden xl:block">
            Nook.
          </h1>
          <h1 className="font-serif font-bold text-3xl text-[#2F3E46] xl:hidden">
            N.
          </h1>
        </Link>

        <nav className="flex-1 space-y-4 w-full">
          <DesktopNavItem
            icon={<Home size={26} />}
            text="Registry"
            href="/home"
            active={isActive("/home")}
          />
          <DesktopNavItem
            icon={<Search size={26} />}
            text="Explore"
            href="/explore"
            active={isActive("/explore")}
          />
          <DesktopNavItem
            icon={<User size={26} />}
            text="Profile"
            href={username ? `/${username}` : "#"}
            active={isActive(`/${username}`)}
          />
        </nav>

        <Link
          href="/create"
          className="w-12 h-12 xl:w-full bg-[#2F3E46] hover:bg-[#1a2429] text-white font-bold rounded-full xl:rounded-sm shadow-sm transition-colors mb-6 flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          <span className="hidden xl:inline text-lg">Declare</span>
        </Link>

        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 xl:p-3 hover:bg-[#E1E5EA]/50 rounded-full xl:rounded-sm cursor-pointer transition-colors mt-auto w-full justify-center xl:justify-start group"
        >
          <div className="h-10 w-10 bg-[#D4A373] text-white rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm uppercase">
            {username ? username.substring(0, 2) : "?"}
          </div>
          <div className="hidden xl:block flex-1 leading-none overflow-hidden">
            <p className="font-bold text-sm truncate">
              {username || "Loading..."}
            </p>
            <p className="text-xs text-[#6B7280]">Sign Out</p>
          </div>
          <LogOut
            size={20}
            className="text-nook-subtle hidden xl:block group-hover:text-[#BF4343] transition-colors"
          />
        </div>
      </aside>

      {/* --- MOBILE VIEW (Horizontal Bottom) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-nook-border flex justify-around items-center p-3 pb-safe z-50">
        {/* 1. HOME */}
        <Link
          href="/home"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive("/home") ? "text-[#2F3E46]" : "text-nook-subtle"
          }`}
        >
          <Home
            size={24}
            fill={isActive("/home") ? "#2F3E46" : "none"}
            className={isActive("/home") ? "opacity-100" : "opacity-70"}
          />
        </Link>

        {/* 2. EXPLORE (New Added Item) */}
        <Link
          href="/explore"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive("/explore") ? "text-[#2F3E46]" : "text-nook-subtle"
          }`}
        >
          <Search
            size={24}
            strokeWidth={isActive("/explore") ? 3 : 2}
            className={isActive("/explore") ? "opacity-100" : "opacity-70"}
          />
        </Link>

        {/* 3. CREATE */}
        <Link
          href="/create"
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive("/create") ? "text-[#2F3E46] scale-110" : "text-[#2F3E46]"
          }`}
        >
          <PlusSquare size={28} strokeWidth={2.5} />
        </Link>

        {/* 4. PROFILE */}
        <Link
          href={username ? `/${username}` : "/login"}
          className={`flex flex-col items-center gap-1 p-2 ${
            isActive(`/${username}`) ? "text-[#2F3E46]" : "text-nook-subtle"
          }`}
        >
          <User
            size={24}
            fill={isActive(`/${username}`) ? "#2F3E46" : "none"}
            className={isActive(`/${username}`) ? "opacity-100" : "opacity-70"}
          />
        </Link>
      </nav>
    </>
  );
}

function DesktopNavItem({ icon, text, href, active }: any) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-4 px-4 xl:px-4 py-3 rounded-full xl:rounded-full cursor-pointer transition-colors text-xl justify-center xl:justify-start ${
          active
            ? "font-bold text-[#2F3E46] bg-[#E1E5EA]/30"
            : "text-[#1F2933] hover:bg-[#E1E5EA]/50"
        }`}
      >
        {icon} <span className="hidden xl:inline">{text}</span>
      </div>
    </Link>
  );
}
