"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  Share2,
  Upload,
  Loader2,
  Camera,
  X,
  ShieldAlert
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useInView } from "react-intersection-observer";

// --- SUB-COMPONENT 1: THE AI JUDGE MODAL ---
function ProofVerificationModal({ 
  isOpen, 
  onClose, 
  commitmentId, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  commitmentId: number; 
  onSuccess: (reason: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'judging' | 'approved' | 'rejected'>('idle');
  const [message, setMessage] = useState('');
  const [aiReason, setAiReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setStatus('idle');
      setMessage('');
      setAiReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setStatus('judging');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('commitment_id', commitmentId.toString());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-commitment`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();

      if (data.status === 'approved') {
        setStatus('approved');
        setMessage(data.message);
        setAiReason(data.ai_analysis || "The Judge is satisfied.");
        setTimeout(() => onSuccess(data.ai_analysis), 3000); 
      } else {
        setStatus('rejected');
        setMessage(data.message);
        setAiReason(data.ai_analysis || "Evidence insufficient.");
      }
    } catch (e) {
      setStatus('rejected');
      setMessage("Connection error. The Judge is unreachable.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2933]/80 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-[#D4A373]">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#F5F7FA]">
          <h3 className="font-serif font-bold text-[#1F2933] text-lg">Submit Proof</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#1F2933]">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload a photo or screenshot. The AI Judge will analyze it immediately.
              </p>
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#D4A373] transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                     <div className="text-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600 mb-2 mx-auto" />
                        <p className="text-sm text-gray-800 font-medium truncate max-w-[200px]">{file.name}</p>
                     </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-[#D4A373]" />
                      <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              <button 
                onClick={handleSubmit}
                disabled={!file}
                className="w-full py-3 bg-[#2F3E46] text-white font-bold rounded-sm uppercase tracking-wide hover:bg-[#1a2429] disabled:opacity-50 transition-all"
              >
                Submit Evidence
              </button>
            </div>
          )}

          {status === 'judging' && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-pulse">
              <Loader2 className="w-12 h-12 text-[#D4A373] animate-spin" />
              <div>
                <h4 className="font-serif text-lg text-[#1F2933] font-bold">Judging...</h4>
                <p className="text-sm text-gray-500">The AI is analyzing your proof.</p>
              </div>
            </div>
          )}

          {status === 'approved' && (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="font-serif text-xl text-green-700 font-bold">VERDICT: TRUE</h4>
              <p className="text-sm text-green-800 bg-green-50 p-3 rounded border border-green-100">"{aiReason}"</p>
            </div>
          )}

          {status === 'rejected' && (
            <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h4 className="font-serif text-xl text-red-700 font-bold">VERDICT: FALSE</h4>
              <p className="text-sm text-red-800 bg-red-50 p-3 rounded border border-red-100">"{aiReason}"</p>
              <button onClick={() => setStatus('idle')} className="text-sm underline text-gray-500 mt-2">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 2: THE HONOR CODE MODAL ---
function HonorCodeModal({
  isOpen,
  onClose,
  onConfirm,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2933]/90 backdrop-blur-sm transition-all">
      <div className="bg-[#1F2933] w-full max-w-sm rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2 border border-yellow-700/50">
            <ShieldAlert className="w-8 h-8 text-yellow-500" />
          </div>
          
          <h3 className="font-serif font-bold text-white text-xl tracking-wide">Honor Code Check</h3>
          
          <div className="text-gray-300 text-sm leading-relaxed space-y-3">
            <p>Nook is built on verifiable truth. The "Judge" is the preferred way to clear your debt.</p>
            <p className="font-medium text-yellow-500/90">
              Only use this manual override if your task is impossible to photograph (e.g. internal reflection, conversation).
            </p>
            <p>By clicking below, you stake your reputation on this truth.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2 bg-[#D4A373] text-white rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-[#c49261] disabled:opacity-50 shadow-lg"
            >
              {loading ? "Verifying..." : "I Vow It Is Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- MAIN COMPONENT ---
export default function CommitmentCard({ item }: { item: any }) {
  const [status, setStatus] = useState(item.status);
  const [witnessCount, setWitnessCount] = useState(item.witness_count);
  const [isMyCommitment, setIsMyCommitment] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  
  // Modals State
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isHonorModalOpen, setIsHonorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
    delay: 500, 
  });

  useEffect(() => {
    if (inView) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/commitments/${item.id}/witness`, {
        method: "POST",
      });
      setWitnessCount((prev: number) => prev + 1);
    }
  }, [inView, item.id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === item.owner.id) {
        setIsMyCommitment(true);
        setCurrentUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, [item.owner.id]);

  const handleAiSuccess = () => {
    setStatus("kept");
    setIsProofModalOpen(false);
  };

  const handleManualConfirm = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/commitments/${item.id}/complete`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUid, proof: "Self-verified (Honor Code)" }),
        });
        
        if (res.ok) {
            setStatus("kept");
            setIsHonorModalOpen(false);
        } else {
            const err = await res.json();
            alert(err.detail || "Error updating status");
        }
    } catch(e) { 
        console.error(e);
        alert("Connection failed");
    } finally { 
        setLoading(false); 
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${item.owner.username}`;
    const text = `I just bet my reputation on Nook.\n\n"${item.text}"\n\nWitness me: ${url}`;
    if (navigator.share) {
      navigator.share({ title: "Nook Protocol", text: text, url: url });
    } else {
      navigator.clipboard.writeText(text);
      alert("Link copied to clipboard.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* 1. AI PROOF MODAL */}
      <ProofVerificationModal 
        isOpen={isProofModalOpen} 
        onClose={() => setIsProofModalOpen(false)} 
        commitmentId={item.id}
        onSuccess={handleAiSuccess}
      />

      {/* 2. HONOR CODE MODAL */}
      <HonorCodeModal 
        isOpen={isHonorModalOpen}
        onClose={() => setIsHonorModalOpen(false)}
        onConfirm={handleManualConfirm}
        loading={loading}
      />

      {/* THE CARD */}
      <div
        ref={ref}
        className="p-4 sm:p-6 border-b border-nook-border hover:bg-white transition-colors group relative"
      >
        <div className="flex gap-4">
          <Link
            href={`/${item.owner.username}`}
            className="h-10 w-10 sm:h-12 sm:w-12 bg-[#E1E5EA] text-[#2F3E46] rounded-full flex-shrink-0 flex items-center justify-center font-serif font-bold text-lg uppercase hover:bg-[#D4A373] hover:text-white transition-colors"
          >
            {item.owner.username.substring(0, 2)}
          </Link>

          <div className="flex-1 min-w-0">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-start">
              <Link
                href={`/${item.owner.username}`}
                className="flex items-center gap-2 truncate hover:underline decoration-[#9AA5B1]"
              >
                <span className="font-bold text-[#1F2933] truncate">
                  {item.owner.username}
                </span>
                <span className="text-nook-subtle text-sm truncate">
                  @{item.owner.username}
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="text-nook-subtle hover:text-[#2F3E46] transition-colors p-1"
                  title="Share to Public"
                >
                  <Share2 size={16} />
                </button>

                {/* --- ACTION BUTTONS --- */}
                {status === "pending" && isMyCommitment ? (
                   <div className="flex gap-2">
                      {/* 1. AI VERIFY BUTTON (Gold) */}
                      <button
                        onClick={() => setIsProofModalOpen(true)}
                        className="flex items-center gap-1.5 bg-[#D4A373] text-white px-3 py-1.5 rounded-sm text-xs font-bold hover:bg-[#c49261] transition-all shadow-sm hover:shadow-md"
                      >
                        <Camera size={14} />
                        Submit Proof
                      </button>

                      {/* 2. MANUAL BUTTON (Gray) triggers Honor Modal */}
                      <button
                        onClick={() => setIsHonorModalOpen(true)}
                        className="flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-400 rounded-sm hover:bg-gray-200 hover:text-gray-600 transition-colors"
                        title="Manual Check (Honor Code)"
                      >
                        <Check size={14} />
                      </button>
                   </div>
                ) : (
                  <MoreHorizontal
                    size={16}
                    className="text-nook-subtle flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            </div>

            <p className="mt-2 mb-3 text-[17px] leading-relaxed text-[#1F2933] font-serif break-words">
              {item.text}
            </p>

            <div className="flex flex-wrap gap-y-2 items-center justify-between mt-3">
              <div
                className={`flex items-center gap-1.5 ${
                  status === "pending"
                    ? "text-[#D4A373]"
                    : status === "kept"
                    ? "text-[#5C7F67]"
                    : "text-[#8C4A4A]"
                } bg-opacity-10 px-2 py-1 rounded-sm`}
              >
                {status === "pending" ? (
                  <Clock size={14} />
                ) : status === "kept" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {status === "pending"
                    ? `Due: ${formatDate(item.deadline)}`
                    : status === "kept"
                    ? "Kept"
                    : "Broken"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-nook-subtle text-xs group-hover:text-[#2F3E46] transition-colors ml-auto">
                <Eye size={16} />
                <span>{witnessCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}