import { connection } from "next/server";
import { fetchPosts, ApiError, type Post } from "@/lib/api";

export default async function RecentPosts() {
  // Makes this work wait for a real request instead of running once at build time.
  await connection();

  // INTENTIONAL LEARNING SIMULATION:
  // artificial 2-second delay so the Suspense fallback is visible.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let posts: Post[] = [];
  let errorMessage: string | null = null;

  // Only the request is inside try/catch
  try {
    posts = await fetchPosts();
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? "Recent posts are unavailable right now. The service replied with an error."
        : "We couldn't reach the posts service. Please try again later.";
  }

  return (
    <section aria-labelledby="recent-heading" className="rounded border p-4">
      <h2 id="recent-heading" className="mb-2 text-xl font-semibold">
        Recent posts
      </h2>

      {errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {posts.slice(0, 3).map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
