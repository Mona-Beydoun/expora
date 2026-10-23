## Initial Predictions (written BEFORE implementation)

### 1. Where will each of the three requests run?
- Employee profile: on the server (Server Component).
- Recent posts preview: on the server (async Server Component).
- Explore all posts (button): in the browser (Client Component, after a click).

### 2. What should remain visible while the server posts preview loads?
The title, intro text, profile, and client explorer. Only the preview section shows its fallback.

### 3. Will wrapping a click-handler fetch in Suspense automatically display its fallback?
No. Suspense only works with components that suspend during rendering, so I need my own loading state.

### 4. If an HTTP response has status 503, will `fetch` automatically throw?
No. fetch only throws on network failures. For a 503 I have to check response.ok myself.

