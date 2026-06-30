# Implementation Journal

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
