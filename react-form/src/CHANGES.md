# Implementation Journal

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
