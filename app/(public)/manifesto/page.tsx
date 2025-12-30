"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-nook-paper text-[#1F2933] font-sans selection:bg-[#2F3E46] selection:text-white">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full bg-nook-paper/95 backdrop-blur-sm border-b border-nook-border z-50">
        <div className="max-w-3xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="font-serif font-bold text-2xl tracking-tight text-[#2F3E46]">
            Nook.
          </Link>
          <Link href="/" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2933] flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Return Home
          </Link>
        </div>
      </nav>

      {/* --- The Document --- */}
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-32">
        
        <header className="mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-nook-subtle mb-4">Protocol v1.0</p>
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-[#1F2933] mb-6">
            The Public Ledger Manifesto.
          </h1>
          <p className="text-xl text-[#6B7280] font-serif italic">
            "We do not rise to the level of our goals. We fall to the level of our systems."
          </p>
        </header>

        <article className="prose prose-lg prose-slate font-serif text-[#2F3E46] leading-relaxed space-y-8">
          
          <section>
            <h3 className="font-sans font-bold text-lg uppercase tracking-wide text-[#1F2933] mb-2">I. The Problem</h3>
            <p>
              Talk is cheap. In the digital age, we broadcast our intentions ("I'm starting a podcast," "I'm going to the gym") to receive dopamine hits before we have done the work. The "Like" button has destroyed accountability. We celebrate the announcement, not the achievement.
            </p>
          </section>

          <hr className="border-nook-border" />

          <section>
            <h3 className="font-sans font-bold text-lg uppercase tracking-wide text-[#1F2933] mb-2">II. The Solution</h3>
            <p>
              Nook is a return to the old world. A world where your word was your bond. We believe that the most powerful motivator in human history is not reward, but the <strong>fear of public failure</strong>.
            </p>
            <p>
              Nook strips away the noise. No comments to soothe your ego. No likes to validate your procrastination. Only a cold, hard record of what you said you would do.
            </p>
          </section>

          <hr className="border-nook-border" />

          <section>
            <h3 className="font-sans font-bold text-lg uppercase tracking-wide text-[#1F2933] mb-2">III. The Laws</h3>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#D4A373]">
              <li>
                <strong>Immutability:</strong> Once a commitment is sealed, it cannot be edited. Typos are permanent. Regrets are permanent.
              </li>
              <li>
                <strong>The Reaper:</strong> Deadlines are absolute. If the clock strikes zero and the task is unfinished, the system marks it "Broken." This badge remains on your profile forever.
              </li>
              <li>
                <strong>The Witness:</strong> We track every pair of eyes that sees your promise. A promise made in private is easy to break. A promise witnessed by 100 people is a contract.
              </li>
            </ul>
          </section>

          <div className="pt-12 mt-12 border-t border-nook-border">
            <p className="font-sans text-sm text-nook-subtle mb-6">Signed,</p>
            <div className="font-serif text-3xl font-bold text-[#1F2933]">The Nook Protocol</div>
          </div>

        </article>

        {/* --- Footer CTA --- */}
        <div className="mt-20 p-8 bg-white border border-nook-border rounded-sm text-center">
          <p className="font-sans text-[#6B7280] mb-6">Are you ready to sign your name?</p>
          <Link href="/create" className="inline-block bg-[#2F3E46] text-white px-8 py-3 font-bold rounded-sm hover:bg-[#1a2429] transition-all">
            Start Your Ledger
          </Link>
        </div>

      </main>
    </div>
  );
}