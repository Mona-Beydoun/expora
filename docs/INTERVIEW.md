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

---

## What I Learned (after testing)

### Predictions I got right
All four of my predictions matched what I observed: the profile and preview run on the server, the shell stays visible while the preview loads, Suspense does not show a fallback for a click-handler fetch, and fetch does not throw on a 503.

### Predictions I got wrong or only partly right
None were wrong, but I learned two new things. First, a `try/catch` should wrap only the request, not the JSX, because the lint rule `react-hooks/error-boundaries` flagged my first version. Second, clicking Retry while the HTTP error scenario is still selected fails again, because the same simulated 503 is repeated.

---

## Interview Answers

### 1. Where does each request execute, and what evidence helped me verify it?
The employee profile and the recent posts preview run on the server, because they are async Server Components, so Node makes the request to JSONPlaceholder. The "Load posts" request runs in the browser, because it is in a Client Component and starts from a click. I verified this in the browser's Network tab: only the click request to `jsonplaceholder.typicode.com/posts?userId=1` appeared. The profile and preview requests never appeared there.

### 2. Why did I choose server fetching for the profile and client fetching for the button?
The profile is needed as soon as the page opens, so the server can fetch it before sending the page and no user action is needed. The full posts list is only needed when the user asks for it, so it makes sense to load it on demand in the browser after a click. This also avoids loading a big list that the user may never open.

### 3. What activates the preview's Suspense fallback? Why doesn't the click-handler request activate it automatically?
The fallback appears while the async Server Component `RecentPosts` is still waiting on its `await` (the connection call and the 2-second delay). React sees that the component is pending and shows the fallback of the `<Suspense>` boundary around it. A fetch inside an `onClick` is ordinary async code that React does not track during rendering, so Suspense does not know about it. That is why I made my own `status` state (idle, loading, success, error) for the client explorer.

### 4. What would change if I moved the preview's boundary around the whole dashboard?
I tried wrapping the whole dashboard in one Suspense boundary and reloaded. The title and profile were hidden until the 2-second delay finished, and then everything appeared together.

### 5. How does my custom error class help, and what does `super(message)` do?
`ApiError` extends `Error` and also stores the HTTP `status`. My `parseResponse` function checks `response.ok` and throws an `ApiError` for a bad status, and my components use `error instanceof ApiError` to tell an HTTP failure apart from other errors, such as a network failure. `super(message)` calls the built-in `Error` constructor, so the `message` and stack trace are set up correctly. A subclass must call `super` before it can use `this`.

### 6. What is the difference between an HTTP failure, a network failure, and an empty result?
An HTTP failure means the server replied, but with a bad status like 404 or 503. `fetch` still resolves with a Response, so I check `response.ok` myself and throw `ApiError`. A network failure means no reply arrived at all (for example, no internet), so `fetch` itself rejects and there is no Response. An empty result is a successful 200 response with an empty array `[]`. It is not an error, so the app shows "No posts found" instead of an error message.

### 7. What happens if employee ID 1 is changed to 2 in all three sections?
All three sections use the single constant `EMPLOYEE_ID` in `lib/api.ts`, so I change it in one place. The profile would show employee 2's name, email, and company, the preview would show three posts of user 2, and the client explorer would load user 2's posts.

### 8. Which decision did I personally verify rather than accepting without checking?
I verified that my server requests do not run in the browser by checking the Network tab: the profile and preview requests never appeared, and only the click request did. I also verified the lint problem myself. `npx tsc --noEmit` showed no errors, but `npm run lint` reported errors, so I changed my `try/catch` to wrap only the request.

---

## AI Usage
I used AI to help build this project. One suggestion it gave me was to build the profile JSX inside the `try` block of `EmployeeProfile`. I checked it by running `npm run lint`, which reported `react-hooks/error-boundaries` errors, even though TypeScript showed no errors. I changed the code so only `await fetchEmployee()` is inside `try/catch`, and the JSX is built afterward. I accepted the idea of catching errors close to the section, but changed how it was written.
