import Link from "next/link";
import { MoreHorizontal, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";

// This function runs on the SERVER. It's fast.
async function getFeed() {
  const res = await fetch("http://127.0.0.1:8000/feed", {
    cache: "no-store", // Ensures we always get fresh data
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Feed() {
  const commitments = await getFeed();

  // Helper for dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric"
    });
  };

  if (commitments.length === 0) {
    return <div className="p-12 text-center text-[#9AA5B1]">The registry is empty.</div>;
  }

  return (
    <div className="w-full">
      {commitments.map((item: any) => (
        <div key={item.id} className="p-4 sm:p-6 border-b border-[#E1E5EA] hover:bg-white transition-colors cursor-pointer group">
          <div className="flex gap-4">
            {/* Avatar Link */}
            <Link href={`/${item.owner.username}`} className="h-10 w-10 sm:h-12 sm:w-12 bg-[#E1E5EA] text-[#2F3E46] rounded-full flex-shrink-0 flex items-center justify-center font-serif font-bold text-lg uppercase hover:bg-[#D4A373] hover:text-white transition-colors">
              {item.owner.username.substring(0, 2)}
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <Link href={`/${item.owner.username}`} className="flex items-center gap-2 truncate hover:underline decoration-[#9AA5B1]">
                  <span className="font-bold text-[#1F2933] truncate">{item.owner.username}</span>
                  <span className="text-[#9AA5B1] text-sm truncate">@{item.owner.username}</span>
                </Link>
                <MoreHorizontal size={16} className="text-[#9AA5B1] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="mt-1 mb-3 text-[17px] leading-relaxed text-[#1F2933] font-serif break-words">
                {item.text}
              </p>

              <div className="flex flex-wrap gap-y-2 items-center justify-between mt-3">
                <div className={`flex items-center gap-1.5 ${item.status === 'pending' ? "text-[#D4A373]" : item.status === 'kept' ? "text-[#5C7F67]" : "text-[#8C4A4A]"} bg-opacity-10 px-2 py-1 rounded-sm`}>
                   {item.status === 'pending' ? <Clock size={14} /> : item.status === 'kept' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                   <span className="text-xs font-bold uppercase tracking-wider">
                     {item.status === 'pending' ? `Due: ${formatDate(item.deadline)}` : item.status === 'kept' ? "Kept" : "Broken"}
                   </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#9AA5B1] text-xs group-hover:text-[#2F3E46] transition-colors ml-auto">
                  <Eye size={16} />
                  <span>{item.witness_count}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="py-12 text-center text-[#9AA5B1] text-sm italic">You are all caught up.</div>
    </div>
  );
}