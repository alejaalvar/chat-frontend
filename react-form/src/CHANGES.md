# Implementation Journal

---

## Fix: iOS WebKit ITP — contacts failing on all iOS browsers

### What changed

**`public/_redirects`** — added an API proxy rule above the existing SPA rule:
```
/api/*  https://instant-messaging-app-production.up.railway.app/api/:splat  200
/*      /index.html   200
```

**`src/context/SocketContext.tsx`** — changed `VITE_API_URL` → `VITE_SOCKET_URL`. Socket.IO must still reach Railway directly (Netlify can't proxy WebSocket upgrades), so it needs its own env var separate from the REST API URL.

**`src/components/Sidebar.tsx`** — added `r.ok` check before `.json()` in the contacts fetcher. Previously, a non-OK response (like a plain-text 401) would cause `.json()` to throw a WebKit-specific SyntaxError: "The string did not match the expected pattern." Now it throws a readable message instead.

### Root cause

On iOS, **all browsers use WebKit** — Apple mandates it. WebKit's ITP (Intelligent Tracking Prevention) classified Railway (`instant-messaging-app-production.up.railway.app`) as a third-party domain and blocked the `jwt` cookie from being sent in cross-origin fetch requests. Even though the cookie is set with `SameSite=None; Secure`, ITP intercepts it before it can leave the browser. The backend returned a plain-text 401, `.json()` threw, and WebKit surfaced it as "The string did not match the expected pattern."

This affected every browser on iOS (Safari, Chrome, DuckDuckGo) because they all share the same WebKit engine.

### How the proxy fix works

With the `/api/*` proxy rule in `_redirects`, all REST API calls go from the browser to `https://cs314-chat-app.netlify.app/api/...` (same origin). Netlify proxies them server-to-server to Railway. The browser no longer makes a cross-origin request, so ITP never fires. The `jwt` cookie is now stored for the Netlify domain and sent with every same-origin `/api/*` request automatically.

### Netlify env var changes required (do in dashboard)

- `VITE_API_URL` → `""` (empty string — makes REST fetch calls use relative paths like `/api/...`)
- `VITE_SOCKET_URL` → `https://instant-messaging-app-production.up.railway.app`

After updating env vars, trigger a new deploy in the Netlify dashboard (env var changes alone don't rebuild).

### Local `.env` changes required

Add `VITE_SOCKET_URL=http://localhost:3001` alongside the existing `VITE_API_URL=http://localhost:3001`.

### Socket.IO note

The socket connects directly to Railway (`VITE_SOCKET_URL`). After this change, the `jwt` cookie is stored for the Netlify domain and won't be sent with the socket handshake to Railway. Socket-based message delivery should be tested on iOS after the contacts fix is confirmed; if routing breaks, the follow-up fix is to pass `auth: { userId: user.id }` in the socket options and update the backend socket handler to read from `socket.handshake.auth`.

---

---

## Netlify deployment prep

### What changed

**`public/_redirects`** (new file) — one-line Netlify redirect rule: `/* /index.html 200`. Without this, navigating directly to any client-side route (`/dashboard`, `/login`, etc.) would return a 404 from Netlify's file server. React Router only handles routes after `index.html` has loaded; this rule ensures every request goes there first.

**`.gitignore`** — added `.env`. The `.env` file was not previously ignored. While `VITE_API_URL` is not itself secret, committing `.env` files creates a habit that becomes dangerous when real secrets (JWT keys, DB passwords) are added. Netlify build-time environment variables replace the committed value.

### Netlify setup (done in dashboard, not code)

- Base directory: `react-form`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL = https://instant-messaging-app-production.up.railway.app`
- Site name: `cs314-chat-app` (backend CORS already allows this origin)

---

## Mobile dashboard — panel swap

### What changed

**`src/pages/DashboardPage.tsx`**
Two conditional class suffixes added to the column divs:

```tsx
<div className={`col-md-3 p-0${selectedContact ? " d-none d-md-block" : ""}`}>
<div className={`col-md-9 p-0${!selectedContact ? " d-none d-md-block" : ""}`}>
```

No other files changed.

### Why

Below Bootstrap's `md` breakpoint (768px), both columns stacked full-width — sidebar on top, empty message board below. Neither panel was usable. The `selectedContact` state that already existed in `DashboardPage` is the natural driver for which panel a mobile user should see:
- `null` → browsing contacts → show sidebar
- non-null → in a conversation → show message board

### How `d-none d-md-block` works

`d-none` sets `display: none` (element takes no space). `d-md-block` overrides that back to `display: block` at the `md` breakpoint and wider. Together they mean "hidden on mobile, visible on desktop." This is the standard Bootstrap responsive column visibility pattern, and follows the same conditional className string pattern already used in the app (navbar collapse, etc.).

### Decisions made

- **No new state** — `selectedContact` already encodes the view the user should be in. Driving mobile visibility from it keeps the component tree exactly as-is.
- **X button becomes "back"** — `MessageBoardHeader`'s dismiss button already calls `setSelectedContact(null)`, which now returns the user to the contact list on mobile. No prop or component changes needed.
- **Empty state hidden on mobile** — the "Select a contact to start chatting" placeholder in MessageBoard is hidden on mobile (it's behind `d-none` when no contact is selected). On mobile, the contact list is the home screen; there's no in-between state.

### Areas to revisit

- No new areas introduced. The existing "hamburger close on navigate" note from the homepage navbar is unrelated.

---

## HomePage redesign — landing page with navbar, hero, and footer

### What changed

**`src/pages/HomePage.tsx`** — complete rewrite. The previous file was a bare stub (`<main><h1>Home</h1></main>`) with no layout, no Bootstrap classes, and no way for a user to navigate to login or sign up.

The new page is a three-section flex layout:
- **Navbar** — `navbar-expand-md`, collapses to hamburger on mobile. Contains the "Chat App" brand and Log In / Sign Up buttons.
- **Main/hero** — vertically centered single column. Headline ("Welcome to Chat App"), two paragraphs (origins, privacy/simplicity), and two body CTAs (Log In + Get Started).
- **Footer** — copyright line pinned to the bottom of the viewport.

### Decisions made

- **React `useState` toggler instead of Bootstrap JS** — the navbar collapse animation needs the Bootstrap JS bundle. Importing it risked interfering with `ProfileSetupModal`, which is manually controlled via React state (add/remove `show d-block`). The existing "manual Bootstrap control via React state" pattern is already established in the app, so the same approach was used here: `navOpen` state + conditionally appending `show` to the collapse div's class list.

- **No shared `<Navbar>` component** — the homepage navbar is homepage-specific. The dashboard has a completely different layout (no top nav at all). Extracting a shared component would be premature for a single use site.

- **`bg-body-secondary` as the page background** — matches the sidebar's background color and reads as the neutral "shell" color already established in the app.

- **`badge bg-primary rounded-pill` on the headline** — mirrors the "Messaging" badge in the Sidebar heading; reuses the most prominent accent already in the app.

- **`col-md-8 mx-auto` on paragraphs** — constrains line length on wide screens for readability without adding any custom CSS.

### Areas to revisit

- **Navbar active state** — if more top-level pages are added (e.g. an "About" page), the navbar links will need an active indicator. React Router's `<NavLink>` with `isActive` handles this cleanly.
- **Hamburger close on navigate** — clicking a nav link on mobile doesn't close the menu. Could be fixed by calling `setNavOpen(false)` in each link's `onClick`, or by wrapping links in a component that listens to route changes.

---

## ProtectedRoute — auth guard + context re-hydration

### What changed

**New file — `src/components/ProtectedRoute.tsx`**
A wrapper component placed around any route that requires authentication. On mount, if `user` is already in context (the user just navigated from login), it renders children immediately with no fetch. If `user` is null (page refresh, direct URL entry, fresh browser), it calls `GET /api/auth/userinfo` with the `jwt` cookie. On a 200 response it seeds `UserContext` with the returned user and renders children. On any error (401, 403, network failure) it redirects to `/login` with `replace: true` so the back button doesn't send the user back to a route they can't access. A full-page Bootstrap spinner is shown during the check.

**`src/App.tsx`**
The `/dashboard` route is now wrapped in `<ProtectedRoute>`.

### Why this was needed

React Context is in-memory only and resets to `null` on every page load. Two bugs shared this root cause:

1. **Unauthenticated access** — any user (or browser with no cookie) could navigate directly to `/dashboard`. The sidebar's contacts fetch would get a plain-text `"You are not authenticated!"` response from `verifyToken`, `.json()` would throw, and the error `Unexpected token 'Y', "You are no"...` would appear in the UI.

2. **Context lost on refresh** — a legitimately logged-in user would lose their context on refresh even though the `jwt` cookie was still valid. The socket would never connect and the sidebar would fail the same way.

### Decisions made

- **`useState(!user)`** — if user is already hydrated, `checking` starts as `false` and the `useEffect` exits immediately. This avoids an unnecessary round-trip on every navigation to `/dashboard` after login.

- **`replace: true` on redirect** — prevents the browser's back button from looping the user back to `/dashboard` after being sent to `/login`.

- **No separate `/api/auth/me` endpoint needed** — `GET /api/auth/userinfo` already existed in the backend and returns the full user object including `color`. No backend changes were required.

- **`color` field** — the login/signup responses omit `color` but `/userinfo` includes it. Users who refresh will have a more complete user object in context than users who just logged in. The `User` interface already marks `color` as optional, so this is not a breaking change.

### Areas to revisit

- **Other protected routes** — if new pages are added that require auth, they should also be wrapped in `<ProtectedRoute>`. No mechanism exists yet to protect routes in bulk (e.g. a layout route).
- **Token expiry** — the JWT expires after 3 days. If a user sits on the dashboard longer than that and then tries to send a message, the socket will disconnect and fetches will fail. A 401 interceptor at the fetch layer (or a socket reconnect handler) would handle this gracefully.

---

## Socket error handling + Sidebar loading spinner

### What changed

**`src/components/MessageBoard.tsx`**
Added a `useEffect` that listens for the socket's `error` event and writes the message into the existing `error` state (already rendered by `<AuthError>`). The backend emits this event when `sendMessage` fails — missing fields, unauthorized sender, or a DB write error. Dep array is `[socket]` only since this listener isn't contact-scoped.

**`src/components/Sidebar.tsx`**
Destructured `loading` from the `useFetch` call (the hook already tracked it, it was just unused). Added a Bootstrap `spinner-border` between the SearchBar and the contact list, rendered while `loading` is true. Includes `visually-hidden` text for screen readers. Disappears as soon as the fetch resolves.

### Decisions made

- **Reused existing `error` state** in MessageBoard rather than adding a separate `socketError` state — both fetch errors and socket errors are displayed the same way, so the distinction is not useful to the user.
- **`"error"` is safe as a custom event name in Socket.IO v4** — connection-level errors use `connect_error`, not `error`, so there's no collision with the built-in event.

### Areas to revisit

- No new areas introduced by these changes.

---

## useFetch hook + Socket.IO real-time messaging

### What changed

**New file — `src/hooks/useFetch.ts`**
A generic data-fetching hook that accepts a `fetcher` function (or `null` to skip) and a deps array. Returns `{ data, loading, error }`. Uses a `cancelled` flag to prevent setState calls after a component unmounts. The `null` fetcher pattern is how callers opt out of fetching when a required dep (like `selectedContact`) isn't available yet.

**`src/context/SocketContext.tsx`** (new file)
Manages the Socket.IO client connection. Connects once when the logged-in user is set in context, disconnects on logout or user change. Exports `SocketProvider` and `useSocket()`. Must be nested inside `<UserProvider>` because it calls `useUser()`.

**`src/main.tsx`**
Added `<SocketProvider>` inside `<UserProvider>` so any component in the tree can call `useSocket()` to get the live socket.

**`src/components/Sidebar.tsx`**
Replaced the contacts `useEffect` + `contacts` state with `useFetch`. The hook handles loading state and surfaces errors automatically. The debounced search `useEffect` is kept inline (the debounce timer makes the hook pattern awkward there) but now has a `.catch()` and a `searchError` state. Both `contactsError` and `searchError` are collapsed into a single `error` variable and rendered via `<AuthError>` when non-null.

**`src/components/MessageBoard.tsx`**
- Added `error` state + `.catch()` to the messages fetch; renders `<AuthError>` when set.
- Added a second `useEffect` that subscribes to the socket's `receiveMessage` event. Only appends messages that involve the currently selected contact (by checking sender and recipient `_id`).
- Added `handleSend` — emits `sendMessage` to the socket with `{ sender: user.id, recipient: selectedContact._id, content }`. Does NOT optimistically add the message to state; the backend emits `receiveMessage` back to the sender as a delivery confirmation and the socket listener handles the append.
- Passes `onSend={handleSend}` to `<MessageInput>`.

**`src/components/MessageInput.tsx`**
Converted from a static presentational component to a controlled form. Accepts `onSend: (content: string) => void`. Calls `onSend(text.trim())` on submit and clears the input.

### Decisions made

- **`setError(null)` inside the fetch `.then()`, not the effect body** — the linter flags synchronous `setState` calls directly in the effect body as causing cascading renders. Clearing error in the `.then()` callback is the correct pattern.

- **Socket connection owned by SocketContext, not a component** — tying the connection to a component's lifecycle would disconnect and reconnect on every re-render of that component. A context creates it once per login session.

- **No optimistic message append** — the backend emits `receiveMessage` back to the sender as a delivery confirmation. Appending optimistically and then again on confirmation would duplicate the message. The slight latency (one round-trip) is acceptable and keeps the state simpler.

- **`useFetch` not used for MessageBoard messages** — the messages state needs to be mutated by the socket listener as well as the REST fetch. Keeping it as a local `useState` makes both update paths simple. `useFetch` is a better fit for read-only data (like the contacts list).

### Areas to revisit

- **Socket error handling** — the backend emits an `error` event on `sendMessage` failures (missing fields, unauthorized sender). The frontend currently ignores this event. Consider listening for it in `MessageBoard` and showing an error message.

- **No loading state shown to the user** — `useFetch` tracks `loading` but Sidebar doesn't render a spinner. Easy to add but skipped for now.

- **Context lost on page refresh** — still unresolved. `user` resets to `null` on refresh, which means the socket never connects and the contacts list never loads. A `/api/auth/me` check on app mount would fix this.

---

## Semantic HTML audit and fixes

### What changed

**`SidebarFooter.tsx`** — `<span onClick>` → `<button>`. Same issue as ContactEntry: a span with a click handler is not keyboard accessible. Buttons get focus, Enter/Space handling, and cursor styling for free.

**`Sidebar.tsx`** — outer `<div>` → `<aside>`. The `aside` element is the semantic element for sidebars and supplementary content panels. No visual change.

**`MessageBoardHeader.tsx`** — outer `<div>` → `<header>`. The `header` element marks introductory or navigational content at the top of a section. No visual change.

**`AuthError.tsx`** — `<small className="text-muted">` → `<p role="alert" className="text-danger">`. Two improvements: `role="alert"` causes screen readers to announce the error automatically when it appears in the DOM (without the user needing to navigate to it); `text-danger` (red) is more appropriate than `text-muted` (gray) for an error message.

**`HomePage.tsx` and `NotFoundPage.tsx`** — `<div>` → `<main>`. The `main` element marks the primary content of the page. Browsers and assistive technologies use it as a landmark for "skip to main content" navigation.

### Decisions made

- **MessageBubble not changed to `<article>`** — technically defensible but not a common pattern in chat UIs, and the benefit is marginal. Left as-is.
- **SearchBar icon `<span>` not changed** — it's purely decorative and the span is standard Bootstrap input-group markup. Changing it would be fighting the framework.
- **`<h1><span>` in Sidebar not changed** — the span exists only for styling (pill background on the heading text). That's a legitimate use of span.

### Areas to revisit

- The `LoginPage` and `SignupPage` wrappers could also use `<main>` — not changed here since they use Bootstrap card layouts and the visual impact wasn't verified.

---

## Steps 1–7: Wire sidebar and message board to the backend

### What changed

**New file — `src/context/UserContext.tsx`**
A React Context that holds the logged-in user (`_id`, `firstName`, `lastName`, `email`, `image`, `color`, `profileSetup`) and a `setUser` setter. Exports `UserProvider`, `useUser`, and the `User` type.

**`src/main.tsx`**
Wrapped `<App />` with `<UserProvider>` so all components in the tree can access the user context.

**`src/components/LoginForm.tsx` and `SignupForm.tsx`**
- The `login()` / `signup()` functions now return the full `data.user` object instead of just `data.user.profileSetup`.
- After a successful API response, `setUser(user)` is called to hydrate the context.
- `navigate("/dashboard")` no longer passes any navigate state — user info lives in context.

**`src/pages/DashboardPage.tsx`**
- Removed `useLocation` and navigate state reads.
- Now reads `user` from `useUser()` to derive the initial modal mode (`user?.profileSetup === false ? "setup" : false`).
- Added `selectedContact` state (`Contact | null`) passed down to `<Sidebar>` (as `onContactSelect`) and `<MessageBoard>` (as `selectedContact`).

**`src/components/ContactEntry.tsx`**
- Exports a `Contact` interface (`_id`, `firstName`, `lastName`, `email`, `image?`, `color?`) used across Sidebar, DashboardPage, and MessageBoard.
- Now receives a `contact` object and an `onClick` callback instead of a plain `contactName` string.
- Clicking the entry calls `onClick(contact)`.

**`src/components/SearchBar.tsx`**
- Converted from an uncontrolled input to a controlled input.
- Accepts `value` and `onChange` props — Sidebar owns the search query state.

**`src/components/Sidebar.tsx`**
- Added `onContactSelect` and `onProfileClick` props.
- On mount: fetches `GET /api/contacts/get-contacts-for-list` to populate the contact list.
- On `searchQuery` change: debounces 300ms then calls `POST /api/contacts/search`. When the query is empty, falls back to the contact list without an extra setState.
- Renders `ContactEntry` dynamically from API data.

**`src/components/MessageBoard.tsx`**
- Accepts `selectedContact: Contact | null`.
- Shows an empty state when no contact is selected.
- When `selectedContact` changes, fetches `POST /api/messages/get-messages` with `{ id: selectedContact._id }`.
- Uses `useUser()` to get the current user's `_id` and determines message side (`right` if `message.sender._id === user._id`, else `left`).

### Decisions made

- **`Contact` type lives in `ContactEntry.tsx`** and is imported by Sidebar and MessageBoard. This avoids a shared types file while keeping the type close to the component that renders it. Worth revisiting if the type spreads to more than 3–4 files.

- **Search debounce is 300ms.** Chosen as a standard "fast enough but not spammy" delay. Could be tuned up if the backend is under load.

- **No error handling on fetch calls yet.** All API calls in Sidebar and MessageBoard silently fail (no error state shown to the user). This is a known gap.

### Areas to revisit

- **Message content field name (`content`)** — assumed based on convention. If messages render as blank, check the actual field name in the `Message` model on the backend and update `message.content` in `MessageBoard.tsx` accordingly.

- **Context lost on page refresh** — if the user refreshes the dashboard, `user` is `null` and the `profileSetup` modal logic won't trigger. A `/api/auth/me` endpoint would fix this by re-hydrating context on app load.

- **No error states on fetch** — Sidebar and MessageBoard don't show anything if an API call fails. Consider adding error states.

- **`Contact` type duplication risk** — if the type needs to expand (e.g. add `lastMessageTime`), update it in `ContactEntry.tsx` and the change will propagate via imports.

- **MessageInput is still static** — sending messages is not yet wired up. That will require Socket.IO integration on the frontend.
