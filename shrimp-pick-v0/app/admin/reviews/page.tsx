import { AdminReviewsManager } from "@/components/AdminReviewsManager";
import { getReviews } from "@/lib/api";

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Landing management</p>
        <h1 className="section-title mt-2">Control carousel content</h1>
      </div>
      <AdminReviewsManager initialReviews={reviews} />
    </div>
  );
}
