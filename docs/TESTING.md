# Testing Evidence

**Project:** Expora (Employee Explorer)
**Next.js version:** 16.4.2
**Browser:** Google Chrome
**How I tested:** ran `npm run dev`, did a direct reload (F5) of http://localhost:3000, and kept the DevTools Network tab open.

| # | Check | Expected | Actual | Pass/Fail |
|---|---|---|---|---|
| 1 | Server profile | Name, email, and company of employee 1 (Leanne Graham, Sincere@april.biz, Romaguera-Crona) | The profile section showed the employee 1 data. No request to jsonplaceholder appeared in the browser Network tab, because the request runs on the server. | Pass |
| 2 | Server preview | Fallback shows during the 2s delay while the title and other sections stay visible | After F5, the title and intro appeared immediately. "Loading recent posts…" showed in the preview area for about 2 seconds, then three post titles replaced it. | Pass |
| 3 | Client idle | No client posts request before the first click | With Network filtered by jsonplaceholder, nothing appeared until I clicked Load posts. | Pass |
| 4 | Client slow | Loading feedback appears and repeat clicks cannot start duplicate requests | With Slow selected, "Loading posts…" appeared and the button was disabled while loading. Only one request appeared in the Network tab. | Pass |
| 5 | Client success | Post titles and bodies appear | Titles and bodies appeared. A request to `jsonplaceholder.typicode.com/posts?userId=1` showed in the Network tab, which confirms it runs in the browser. | Pass |
| 6 | HTTP failure | Simulated 503 goes through `parseResponse`, creates an `ApiError`, and shows a message with Retry | The error message with the status 503 and a Retry button appeared. No network request appeared, because the 503 is created locally with `new Response(...)`. | Pass |
| 7 | Empty response | "No posts found" appears and no error message | "No posts found" appeared with no error message. | Pass |
| 8 | Recovery | After an HTTP error, switching to Success and clicking Retry shows posts and clears the error | Clicking Retry while HTTP error was still selected showed the error again, because the same simulated 503 is repeated. After switching to Success and clicking Retry, the posts appeared and the error cleared. | Pass |
| 9 | Section independence | A failed client request does not remove the profile or server preview | After the client error, the profile and recent posts sections were still visible. | Pass |
| 10 | Usability | Labelled controls, visible keyboard focus, readable at around 360px | The scenario selector has a label and the button has text. Pressing Tab showed a focus outline on the select and the button. In DevTools device mode at 360px width, the page was readable with no sideways scrolling. | Pass |

## Steps used for timing checks
I pressed F5 on http://localhost:3000 and watched the Recent posts area. The fallback text appeared for about 2 seconds while the title, intro, and profile stayed visible. I used a direct reload because navigation and prefetching can change what is observed.

## Commands
- `npm run lint`: completed with no errors. My first version reported `react-hooks/error-boundaries` errors because I built JSX inside `try`, even though `npx tsc --noEmit` showed none. I fixed it by keeping only the `await` inside `try/catch`.
- `npm run build`: completed successfully with no errors.

## Screenshots
- Normal state: ![normal](screenshots/01-normal-state.png)
- Server preview loading: ![loading](screenshots/02-server-preview-loading.png)
- Client error: ![error](screenshots/03-client-error.png)
- Empty state: ![empty](screenshots/04-client-empty.png)

## Notes
- The HTTP error and Empty scenarios are local simulations created with `new Response(...)`. They are not real JSONPlaceholder responses.
- The Slow and Success scenarios use the real JSONPlaceholder API.
- The 2-second delay in the server preview is an intentional learning simulation.

## Not tested / limitations
- A real network failure (for example, going offline) was not tested. Only the simulated 503 was tested.
- Only tested in Google Chrome.
- Tested locally with `npm run dev` and `npm run build`. Not deployed.
