"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Flame } from "lucide-react"; // Imported Flame icon for "Trending"
import Sidebar from "@/components/Sidebar";
import CommitmentCard from "@/components/CommitmentCard";
import RightSidebar from "@/components/RightSideBar";

export default function ExplorePage() {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExplore() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/explore`);
        if (res.ok) {
          setCommitments(await res.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchExplore();
  }, []);

  return (
    <div className="min-h-screen bg-nook-paper text-[#1F2933] font-sans">
      <div className="flex w-full min-h-screen">

        <Sidebar />

        <main className="flex-1 border-r border-nook-border min-w-0">
          <div className="sticky top-0 bg-nook-paper/95 backdrop-blur-sm border-b border-nook-border px-4 py-4 z-10">
            <h2 className="font-serif font-bold text-xl flex items-center gap-2">
              <Flame className="text-nook-accent" size={20} />
              High Stakes
            </h2>
          </div>

          <div className="w-full">
            {loading ? (
              <div className="p-12 text-center text-nook-subtle">Finding top commitments...</div>
            ) : commitments.length === 0 ? (
               <div className="p-12 text-center text-nook-subtle">No data yet.</div>
            ) : (
              commitments.map((item: any) => (
                <CommitmentCard key={item.id} item={item} />
              ))
            )}
            <div className="py-12 text-center text-nook-subtle text-sm italic">
              Ranked by Witness Count.
            </div>
          </div>
        </main>

        {/* Right Sidebar (Optional, or can be removed for Explore) */}
        <RightSidebar />

      </div>
    </div>
  );
}