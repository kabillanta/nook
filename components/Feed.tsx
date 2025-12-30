import CommitmentCard from "./CommitmentCard";

async function getFeed() {
  const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/feed", {
    cache: "no-store", 
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Feed() {
  const commitments = await getFeed();

  if (commitments.length === 0) {
    return <div className="p-12 text-center text-nook-subtle">The registry is empty.</div>;
  }

  return (
    <div className="w-full">
      {commitments.map((item: any) => (
        <CommitmentCard key={item.id} item={item} />
      ))}
      <div className="py-12 text-center text-nook-subtle text-sm italic">You are all caught up.</div>
    </div>
  );
}