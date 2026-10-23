"use client";

import { useState } from "react";
import {
  ApiError,
  parseResponse,
  BASE_URL,
  EMPLOYEE_ID,
  type Post,
} from "@/lib/api";

type Scenario = "success" | "slow" | "http-error" | "empty";
type Status = "idle" | "loading" | "success" | "error";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Returns a Response. Two scenarios are LOCAL SIMULATIONS, not real API replies.
async function getResponse(scenario: Scenario): Promise<Response> {
  const url = `${BASE_URL}/posts?userId=${EMPLOYEE_ID}`;

  if (scenario === "slow") {
    await wait(2000); // simulated slowness, then the REAL request
    return fetch(url);
  }

  if (scenario === "http-error") {
    // SIMULATED: a locally created 503, not from JSONPlaceholder
    return new Response(null, {
      status: 503,
      statusText: "Service Unavailable",
    });
  }

  if (scenario === "empty") {
    // SIMULATED: a locally created successful response with an empty array
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetch(url); // success: REAL request
}

export default function PostsExplorer() {
  const [status, setStatus] = useState<Status>("idle");
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [scenario, setScenario] = useState<Scenario>("success");

  async function loadPosts() {
    if (status === "loading") return; // guard against duplicate requests

    setStatus("loading");
    setMessage("");

    try {
      const response = await getResponse(scenario);
      // The SAME check is used for real and simulated responses
      const data = await parseResponse<Post[]>(response);
      setPosts(data);
      setStatus("success");
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(
          `The server replied with an error (status ${error.status}). Please try again.`
        );
      } else {
        setMessage(
          "A network problem or unexpected error happened. Please try again."
        );
      }
      setPosts([]);
      setStatus("error"); // loading ends on failure too
    }
  }

  return (
    <section aria-labelledby="explorer-heading" className="rounded border p-4">
      <h2 id="explorer-heading" className="mb-2 text-xl font-semibold">
        Explore all posts
      </h2>

      <div className="mb-3">
        <label htmlFor="scenario" className="mr-2 block text-sm sm:inline">
          Demo scenario (simulation, applies to the next Load or Retry):
        </label>
        <select
          id="scenario"
          value={scenario}
          onChange={(e) => setScenario(e.target.value as Scenario)}
          disabled={status === "loading"}
          className="rounded border p-1 text-black"
        >
          <option value="success">Success (real API)</option>
          <option value="slow">Slow (2s wait, then real API)</option>
          <option value="http-error">HTTP error (simulated 503)</option>
          <option value="empty">Empty (simulated empty array)</option>
        </select>
      </div>

      {status === "idle" && (
        <p className="mb-2">Click the button to load all posts.</p>
      )}

      <button
        type="button"
        onClick={loadPosts}
        disabled={status === "loading"}
        className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-50"
      >
        {status === "error" ? "Retry" : "Load posts"}
      </button>

      {status === "loading" && (
        <p role="status" className="mt-3">
          Loading posts…
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="mt-3">
          {message}
        </p>
      )}

      {status === "success" && posts.length === 0 && (
        <p className="mt-3">No posts found</p>
      )}

      {status === "success" && posts.length > 0 && (
        <ul className="mt-3 space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <h3 className="font-semibold">{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
