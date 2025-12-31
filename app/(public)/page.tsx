"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Lock,
  Clock,
  Eye,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";

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
    text: '"I publish my first novel draft (50k words) by Dec 31st."',
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
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
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-nook-paper text-[#1F2933]">
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 bg-nook-paper/95 border-b border-nook-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-[#2F3E46]">
            Nook.
          </div>

          {/* Changed: Removed 'hidden md:flex' so buttons show on mobile too */}
          <nav className="flex items-center gap-4 md:gap-8">
            {/* Hide 'Manifesto' text link on small screens to save space */}
            <Link
              href="/manifesto"
              className="hidden md:block text-sm font-medium text-[#4B5563] hover:text-[#1F2933] transition-colors"
            >
              Manifesto
            </Link>

            <div className="hidden md:block h-4 w-px bg-[#E1E5EA]"></div>

            {loadingAuth ? (
              <span className="text-sm text-nook-subtle">...</span>
            ) : user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex text-sm font-bold text-[#6B7280] hover:text-[#BF4343] transition-colors items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>

                <Link
                  href="/home"
                  className="bg-[#2F3E46] text-white px-3 py-2 md:px-5 md:py-2 rounded-sm text-xs md:text-sm font-bold hover:bg-[#1a2429] transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />{" "}
                  <span className="hidden sm:inline">Go to Registry</span>
                  <span className="sm:hidden">Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-[#2F3E46] hover:opacity-80"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#2F3E46] text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-[#1a2429] transition-all"
                >
                  Signup{" "}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        {/* Changed: Reduced padding for mobile (pt-12) vs desktop (md:pt-20) */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 border-b border-nook-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="mb-6 md:mb-8 border-b border-[#1F2933] pb-2 inline-block">
                <p className="font-serif italic text-[#4B5563] text-sm md:text-base">
                  {today}
                </p>
              </div>

              {/* Changed: Text size scales from 4xl (mobile) to 7xl (desktop) */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif text-[#1F2933] leading-tight md:leading-[1.05] mb-6 md:mb-8">
                Your word <br /> is the only <br /> currency.
              </h1>

              <p className="text-lg md:text-xl text-[#4B5563] leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0">
                We built a quiet place for high-stakes accountability. No likes.
                No comments. Just a permanent record of what you said you would
                do.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={user ? "/home" : "/create"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#2F3E46] text-white text-lg font-medium rounded-sm hover:bg-[#1a2429] transition-all shadow-sm"
                >
                  {user ? "View Your Ledger" : "Start Your Ledger"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Changed: Removed pl-10 on mobile. Adjusted background divs to be responsive. */}
            <div className="relative mt-12 lg:mt-0 px-2 lg:pl-10 h-[350px] md:h-[400px] flex items-center">
              {/* Decorative backgrounds now use relative width percentages instead of fixed pixels for mobile safety */}
              <div className="absolute top-4 left-4 right-4 md:left-14 md:right-0 bottom-[-1rem] bg-[#E5E7EB] rounded-sm -z-20 transform rotate-1"></div>
              <div className="absolute top-2 left-4 right-4 md:left-12 md:right-2 bottom-[-0.5rem] bg-[#F3F4F6] rounded-sm -z-10 transform -rotate-1"></div>

              {/* THE ACTIVE CARD */}
              <div className="bg-white border border-nook-border p-6 md:p-10 shadow-lg rounded-sm relative transition-all duration-300 w-full flex flex-col justify-between min-h-[300px] md:min-h-[350px]">
                <div
                  className={`absolute -top-3 -right-3 bg-[#D4A373] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-sm uppercase tracking-wider transform rotate-3 transition-opacity duration-300 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Commitment {current.id}
                </div>

                <div
                  className={`flex items-center justify-between mb-6 md:mb-8 transition-opacity duration-300 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-[#2F3E46] text-white flex items-center justify-center font-serif text-base md:text-lg font-bold rounded-full">
                      {current.initials}
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2933] text-sm md:text-base">
                        {current.name}
                      </p>
                      <p className="text-xs text-nook-subtle">
                        {current.joined}
                      </p>
                    </div>
                  </div>
                  <Clock className="w-5 h-5 text-[#D4A373]" />
                </div>

                <div className="mb-8 md:mb-10 min-h-[5rem] md:min-h-[4rem]">
                  <p className="font-serif text-xl md:text-2xl text-[#1F2933] leading-snug md:leading-normal">
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

                <div
                  className={`grid grid-cols-2 gap-4 border-t border-nook-border pt-4 md:pt-6 transition-opacity duration-300 ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div>
                    <p className="text-[10px] md:text-xs text-nook-subtle uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${current.statusColor}`}
                      ></div>
                      <p className="font-medium text-sm md:text-base text-[#1F2933]">
                        {current.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] md:text-xs text-nook-subtle uppercase tracking-wider mb-1">
                      Deadline
                    </p>
                    <p
                      className={`font-medium text-sm md:text-base ${current.deadlineColor}`}
                    >
                      {current.deadline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-nook-border bg-[#F3F4F6] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2933] mb-4">
                The Protocol
              </h2>
              <p className="text-[#4B5563]">
                Three steps to reputational skin in the game.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-nook-border -z-10"></div>

              {/* STEP 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-white border border-nook-border rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                  <span className="font-serif text-3xl font-bold text-[#2F3E46]">
                    1
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1F2933] mb-2">
                  Define the Terms
                </h3>
                <p className="text-sm text-[#4B5563] max-w-xs mx-auto">
                  State your goal and set a strict deadline. Ambiguity is the
                  enemy of execution.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-white border border-nook-border rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                  <span className="font-serif text-3xl font-bold text-[#2F3E46]">
                    2
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1F2933] mb-2">
                  The Lock
                </h3>
                <p className="text-sm text-[#4B5563] max-w-xs mx-auto">
                  Once published, the commitment is immutable. You cannot edit,
                  delete, or hide it.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-white border border-nook-border rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                  <span className="font-serif text-3xl font-bold text-[#BF4343]">
                    3
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1F2933] mb-2">
                  The Reaper
                </h3>
                <p className="text-sm text-[#4B5563] max-w-xs mx-auto">
                  When the deadline hits, you must provide proof. If you don't,
                  the system marks it "Broken."
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* --- Value Proposition --- */}
        {/* Changed: Reduced padding (py-16) for mobile */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center md:text-left">
              <div className="h-12 w-12 border border-nook-border bg-white flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:border-[#2F3E46] transition-colors">
                <Lock className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">
                Immutable by Design
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                Once a commitment is published, the statement and deadline are
                locked. You cannot edit your way out of a promise.
              </p>
            </div>
            <div className="group text-center md:text-left">
              <div className="h-12 w-12 border border-nook-border bg-white flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:border-[#2F3E46] transition-colors">
                <Eye className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">
                Passive Witnessing
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                Interaction is limited to viewing. The absence of "likes"
                removes the dopamine loop, leaving only pure accountability.
              </p>
            </div>
            <div className="group text-center md:text-left">
              <div className="h-12 w-12 border border-nook-border bg-white flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:border-[#2F3E46] transition-colors">
                <Clock className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">
                The Reaper Protocol
              </h3>
              <p className="text-[#4B5563] leading-relaxed">
                Deadlines are absolute. If the time passes without a resolution,
                the system automatically marks the commitment as Broken.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-nook-border py-12 text-center bg-white">
          <p className="font-serif font-bold text-2xl text-[#2F3E46] mb-4">
            Nook.
          </p>
          <p className="text-nook-subtle text-sm">
            © {new Date().getFullYear()} Nook Inc. Your reputation is your own.
          </p>
        </footer>
      </main>
    </div>
  );
}
