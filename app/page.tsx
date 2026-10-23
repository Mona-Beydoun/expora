import { Suspense } from "react";
import EmployeeProfile from "@/components/EmployeeProfile";
import RecentPosts from "@/components/RecentPosts";
import PostsExplorer from "@/components/PostsExplorer";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Employee Explorer</h1>
      <p>A small dashboard comparing server and client data fetching.</p>

      <Suspense fallback={<p>Loading profile…</p>}>
        <EmployeeProfile />
      </Suspense>

      <Suspense
        fallback={<p role="status">Loading recent posts… (intentional 2-second delay)</p>}
      >
        <RecentPosts />
      </Suspense>
            <PostsExplorer />
    
    </main>
  );
}
