import Link from "next/link";
import { ArrowRight, Lock, Clock, Eye } from "lucide-react";

export default function LandingPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F6F3] text-[#1F2933]">
      
      {/* --- Navbar (Minimalist) --- */}
      <header className="sticky top-0 z-50 bg-[#F7F6F3]/95 border-b border-[#E1E5EA] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-3xl font-bold font-serif tracking-tight text-[#2F3E46]">Nook.</div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/manifesto" className="text-sm font-medium text-[#4B5563] hover:text-[#1F2933] transition-colors">Manifesto</Link>
            <Link href="/pricing" className="text-sm font-medium text-[#4B5563] hover:text-[#1F2933] transition-colors">Membership</Link>
            <div className="h-4 w-px bg-[#E1E5EA]"></div>
            <Link href="/login" className="text-sm font-bold text-[#2F3E46] hover:opacity-80">Log In</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* --- Hero Section (Editorial Style) --- */}
        <section className="relative pt-20 pb-32 border-b border-[#E1E5EA]">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: The Argument */}
            <div className="max-w-xl">
              {/* Date Line (Replaces the "Badge") */}
              <div className="mb-8 border-b border-[#1F2933] pb-2 inline-block">
                <p className="font-serif italic text-[#4B5563]">{today}</p>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold font-serif text-[#1F2933] leading-[1.05] mb-8">
                Your word <br/> is the only <br/> currency.
              </h1>
              
              <p className="text-xl text-[#4B5563] leading-relaxed mb-10 max-w-lg">
                We built a quiet place for high-stakes accountability. 
                No likes. No comments. Just a permanent record of what you said you would do.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-[#2F3E46] text-white text-lg font-medium rounded-sm hover:bg-[#1a2429] transition-all shadow-sm">
                  Start Your Ledger
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/explore" className="inline-flex items-center justify-center px-8 py-4 bg-white border border-[#E1E5EA] text-[#2F3E46] text-lg font-medium rounded-sm hover:bg-gray-50 transition-colors">
                  View Public Record
                </Link>
              </div>
            </div>

            {/* Right: The Evidence (The Card) */}
            <div className="relative pl-10">
              {/* Decorative "Paper Stack" effect behind */}
              <div className="absolute top-4 left-14 right-0 bottom-[-1rem] bg-[#E5E7EB] rounded-sm -z-20 transform rotate-1"></div>
              <div className="absolute top-2 left-12 right-2 bottom-[-0.5rem] bg-[#F3F4F6] rounded-sm -z-10 transform -rotate-1"></div>

              {/* The Actual Card */}
              <div className="bg-white border border-[#E1E5EA] p-10 shadow-lg rounded-sm relative">
                {/* Pin/Stamp graphic */}
                <div className="absolute -top-3 -right-3 bg-[#D4A373] text-white text-xs font-bold px-3 py-1 shadow-sm uppercase tracking-wider transform rotate-3">
                  Commitment #8921
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 bg-[#2F3E46] text-white flex items-center justify-center font-serif text-lg font-bold rounded-full">
                       JD
                     </div>
                     <div>
                       <p className="font-bold text-[#1F2933]">John Doe</p>
                       <p className="text-xs text-[#9AA5B1]">Joined 2023</p>
                     </div>
                  </div>
                  <Clock className="w-5 h-5 text-[#D4A373]" />
                </div>

                <div className="mb-10">
                  <p className="font-serif text-2xl text-[#1F2933] leading-normal">
                    "I will complete the backend migration to PostgreSQL by Tuesday at noon."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#E1E5EA] pt-6">
                  <div>
                    <p className="text-xs text-[#9AA5B1] uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#6B7280]"></div>
                      <p className="font-medium text-[#1F2933]">Pending Outcome</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#9AA5B1] uppercase tracking-wider mb-1">Deadline</p>
                    <p className="font-medium text-[#BF4343]">2 Days Remaining</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Value Proposition (Grid) --- */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="group">
              <div className="h-12 w-12 border border-[#E1E5EA] bg-white flex items-center justify-center mb-6 group-hover:border-[#2F3E46] transition-colors">
                <Lock className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">Immutable by Design</h3>
              <p className="text-[#4B5563] leading-relaxed">
                Once a commitment is published, the statement and deadline are locked. You cannot edit your way out of a promise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="h-12 w-12 border border-[#E1E5EA] bg-white flex items-center justify-center mb-6 group-hover:border-[#2F3E46] transition-colors">
                <Eye className="w-6 h-6 text-[#2F3E46]" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-[#1F2933]">Passive Witnessing</h3>
              <p className="text-[#4B5563] leading-relaxed">
                Interaction is limited to viewing. The absence of "likes" removes the dopamine loop, leaving only pure accountability.
              </p>
            </div>

            {/* Feature 3 */}
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

        {/* --- Footer --- */}
        <footer className="border-t border-[#E1E5EA] py-12 text-center bg-white">
          <p className="font-serif font-bold text-2xl text-[#2F3E46] mb-4">Nook.</p>
          <p className="text-[#9AA5B1] text-sm">
            © {new Date().getFullYear()} Nook Inc. Your reputation is your own.
          </p>
        </footer>
      </main>
    </div>
  );
}