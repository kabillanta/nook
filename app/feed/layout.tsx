import AuthGuard from "@/components/AuthGuard";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
