# Expora: Employee Explorer

**Author:** Mona Beydoun
**Assignment:** TechTalks Next.js Assignment 3, "Yehia Meets Maya"
**Branch:** `assignment-3-maya-interview`
**Repository:** https://github.com/Mona-Beydoun/expora

## Project summary
Expora is a small Next.js App Router dashboard at `/` that shows employee 1 from the JSONPlaceholder API. It compares server and client data fetching and shows how the page behaves when requests are slow, fail, or return nothing.

| Section | Where the request runs | Notes |
|---|---|---|
| Employee profile | Server Component | Name, email, company name |
| Recent posts preview | Async Server Component inside its own Suspense boundary | Up to three post titles |
| Explore all posts | Client Component, after a click | Titles and bodies, loaded on demand |

APIs used: `GET /users/1` and `GET /posts?userId=1` from https://jsonplaceholder.typicode.com. The records are fictional sample data.

## Tech
- Next.js version: **NEXTJS_VERSION**
- React, TypeScript, Tailwind CSS
- Native `fetch`, Suspense, and a custom `ApiError` class (`lib/api.ts`)

## Setup
```bash
git clone https://github.com/Mona-Beydoun/expora.git
cd expora
git switch assignment-3-maya-interview
npm install
npm run dev
```
Open http://localhost:3000. To check the project, run `npm run lint` and `npm run build`.

## Demo controls
The **Demo scenario** selector in "Explore all posts" applies to the **next** Load posts or Retry click. It does not affect the server sections.

| Scenario | What it does | Real or simulated |
|---|---|---|
| Success | Real request to JSONPlaceholder | Real |
| Slow | Waits 2 seconds, then makes the real request | Delay simulated, request real |
| HTTP error | Locally creates a 503 `Response` and passes it through `parseResponse` | **Simulated** |
| Empty | Locally creates a 200 `Response` with `[]` and passes it through `parseResponse` | **Simulated** |

The HTTP error and Empty responses do **not** come from JSONPlaceholder. To see recovery: choose HTTP error, load, then switch to Success and click Retry. Clicking Retry while HTTP error is still selected fails again, because the same simulated 503 is repeated.

## Intentional artificial delay
`RecentPosts` has a **2-second artificial delay** so the Suspense fallback is visible. It is an intentional learning simulation and would be removed in a real app. `await connection()` makes this work run on each request instead of once at build time. Test it with a direct reload.

## Documentation
- `docs/INTERVIEW.md`: predictions and interview answers
- `docs/TESTING.md`: test results and screenshots

## Known limitations
- The employee ID is hardcoded to 1 in `lib/api.ts` (no employee selection).
- The 2-second delay is for demonstration only.
- Success and Slow depend on the public JSONPlaceholder API being available.
- Tested locally with `npm run dev`. Not deployed.