"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Lock, Clock, Eye, LogOut, LayoutDashboard } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';

// --- FIREBASE IMPORTS ---
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

// --- DATA ---
const EXAMPLES = [
  {
    id: "#8921",
    initials: "JD",
    name: "John Doe",
    joined: "Joined 2023",
    text: '"I will complete the backend migration to PostgreSQL by Tuesday at noon."', 
    status: "Pending Outcome",
    deadline: "2 Days Remaining",
    statusColor: "bg-[#6B7280]",
    deadlineColor: "text-[#BF4343]",
  },
  {
    id: "#8922",
    initials: "SM",
    name: "Sarah Miller",
    joined: "Joined 2024",
    text: '"I will run a sub-4 hour marathon before the end of October."',
    status: "Kept Promise",
    deadline: "Achieved Oct 15",
    statusColor: "bg-[#5C7F67]",
    deadlineColor: "text-[#5C7F67]",
  },
  {
    id: "#8923",
    initials: "AK",
    name: "Alex Kim",
    joined: "Joined 2023",
    text: '"I will publish my first novel draft (50k words) by Dec 31st."',
    status: "Broken Promise",
    deadline: "Missed Deadline",
    statusColor: "bg-[#8C4A4A]",
    deadlineColor: "text-[#8C4A4A]",
  },
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  // --- AUTH STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  // 1. Check Login Status on Mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handle Logout directly from Landing Page
  const handleLogout = async () => {
    await signOut(auth);
    // User state will automatically update to null via the listener above
  };

  // --- ANIMATION CYCLE ---
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % EXAMPLES.length);
        setFade(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = EXAMPLES[index];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F6F3] text-[#1F2933]">
      
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 bg-[#F7F6F3]/95 border-b border-[#E1E5EA] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <div className="text-3xl font-bold font-serif tracking-tight text-[#2F3E46]">
            Nook.
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/manifesto" className="text-sm font-medium text-[#4B5563] hover:text-[#1F2933] transition-colors">
              Manifesto
            </Link>
            
            <div className="h-4 w-px bg-[#E1E5EA]"></div>

            {/* --- CONDITIONAL AUTH BUTTONS --- */}
            {loadingAuth ? (
              // Show nothing or a small spinner while checking
              <span className="text-sm text-[#9AA5B1]">...</span>
            ) : user ? (
              // CASE 1: USER IS LOGGED IN
              <>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-bold text-[#6B7280] hover:text-[#BF4343] transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>

                <Link
                  href="/home"
                  className="bg-[#2F3E46] text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-[#1a2429] transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={16} /> Go to Registry
                </Link>
              </>
            ) : (
              // CASE 2: GUEST (NOT LOGGED IN)
              <>
                <Link href="/login" className="text-sm font-bold text-[#2F3E46] hover:opacity-80">
                  Log In
                </Link>
                <Link
                  href="/create"
                  className="bg-[#2F3E46] text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-[#1a2429] transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-32 border-b border-[#E1E5EA]">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="max-w-xl">
              <div className="mb-8 border-b border-[#1F2933] pb-2 inline-block">
                <p className="font-serif italic text-[#4B5563]">{today}</p>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold font-serif text-[#1F2933] leading-[1.05] mb-8">
                Your word <br /> is the only <br /> currency.
              </h1>

              <p className="text-xl text-[#4B5563] leading-relaxed mb-10 max-w-lg">
                We built a quiet place for high-stakes accountability. No likes.
                No comments. Just a permanent record of what you said you would do.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Dynamic Hero Button */}
                <Link
                  href={user ? "/home" : "/create"} // Go to Home if logged in, Create if not
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#2F3E46] text-white text-lg font-medium rounded-sm hover:bg-[#1a2429] transition-all shadow-sm"
                >
                  {user ? "View Your Ledger" : "Start Your Ledger"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative pl-10 h-[400px] flex items-center">
              <div className="absolute top-4 left-14 right-0 bottom-[-1rem] bg-[#E5E7EB] rounded-sm -z-20 transform rotate-1"></div>
              <div className="absolute top-2 left-12 right-2 bottom-[-0.5rem] bg-[#F3F4F6] rounded-sm -z-10 transform -rotate-1"></div>

              {/* THE ACTIVE CARD */}
              <div className="bg-white border border-[#E1E5EA] p-10 shadow-lg rounded-sm relative transition-all duration-300 w-full flex flex-col justify-between min-h-[350px]">
                
                <div className={`absolute -top-3 -right-3 bg-[#D4A373] text-white text-xs font-bold px-3 py-1 shadow-sm uppercase tracking-wider transform rotate-3 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                  Commitment {current.id}
                </div>
                 
                <div className={`flex items-center justify-between mb-8 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#2F3E46] text-white flex items-center justify-center font-serif text-lg font-bold rounded-full">
                    {current.initials}
                    </div>
                    <div>
                    <p className="font-bold text-[#1F2933]">{current.name}</p>
                    <p className="text-xs text-[#9AA5B1]">{current.joined}</p>
                    </div>
                </div>
                <Clock className="w-5 h-5 text-[#D4A373]" />
                </div>

                <div className="mb-10 min-h-[4rem]">
                    <p className="font-serif text-2xl text-[#1F2933] leading-normal">
                        <TypeAnimation
                            key={current.text} 
                            sequence={[current.text]}
                            wrapper="span"
                            speed={60} 
                            cursor={true}
                            repeat={0} 
                        />
                    </p>
                </div>

                <div className={`grid grid-cols-2 gap-4 border-t border-[#E1E5EA] pt-6 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                    <p className="text-xs text-[#9AA5B1] uppercase tracking-wider mb-1">
                    Status
                    </p>
                    <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${current.statusColor}`}></div>
                    <p className="font-medium text-[#1F2933]">
                        {current.status}
                    </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[#9AA5B1] uppercase tracking-wider mb-1">
                    Deadline
                    </p>
                    <p className={`font-medium ${current.deadlineColor}`}>
                        {current.deadline}
                    </p>
                </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* --- Value Proposition --- */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="h-12 w-12 border border-[#E1E5EA] bg-white flex items-center justify-center mb-6 group-hover:border-[#2F3E46] transition-colors">
                <Lock className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">Immutable by Design</h3>
              <p className="text-[#4B5563] leading-relaxed">
                Once a commitment is published, the statement and deadline are locked. You cannot edit your way out of a promise.
              </p>
            </div>
            <div className="group">
              <div className="h-12 w-12 border border-[#E1E5EA] bg-white flex items-center justify-center mb-6 group-hover:border-[#2F3E46] transition-colors">
                <Eye className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">Passive Witnessing</h3>
              <p className="text-[#4B5563] leading-relaxed">
                Interaction is limited to viewing. The absence of "likes" removes the dopamine loop, leaving only pure accountability.
              </p>
            </div>
            <div className="group">
              <div className="h-12 w-12 border border-[#E1E5EA] bg-white flex items-center justify-center mb-6 group-hover:border-[#2F3E46] transition-colors">
                <Clock className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">The Reaper Protocol</h3>
              <p className="text-[#4B5563] leading-relaxed">
                Deadlines are absolute. If the time passes without a resolution, the system automatically marks the commitment as Broken.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#E1E5EA] py-12 text-center bg-white">
          <p className="font-serif font-bold text-2xl text-[#2F3E46] mb-4">Nook.</p>
          <p className="text-[#9AA5B1] text-sm">© {new Date().getFullYear()} Nook Inc. Your reputation is your own.</p>
        </footer>
      </main>
    </div>
  );
}