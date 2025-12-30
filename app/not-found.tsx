import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nook-paper text-[#1F2933] p-6">
      
      {/* Brand Header */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-serif font-bold text-2xl text-[#2F3E46]">
          Nook.
        </Link>
      </div>

      <div className="max-w-md w-full text-center">
        
        {/* Icon Container */}
        <div className="mx-auto h-20 w-20 bg-white border border-nook-border rounded-sm flex items-center justify-center mb-8 shadow-sm">
          <FileQuestion className="w-10 h-10 text-nook-subtle" />
        </div>

        {/* 404 Heading */}
        <h1 className="font-serif text-6xl font-bold text-[#2F3E46] mb-4">
          404
        </h1>
        
        <h2 className="font-serif text-xl font-bold text-[#1F2933] mb-4">
          Record Missing
        </h2>

        {/* Serious Description */}
        <p className="text-[#6B7280] leading-relaxed mb-10">
          The page you are looking for does not exist in the Nook registry. 
          It may have been moved, or the URL is incorrect.
        </p>

        {/* Action Button */}
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2F3E46] text-white font-medium rounded-sm hover:bg-[#1a2429] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Registry
        </Link>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-nook-border">
          <p className="text-xs text-nook-subtle font-mono uppercase tracking-widest">
            Error Code: PAGE_NOT_FOUND
          </p>
        </div>

      </div>
    </div>
  );
}