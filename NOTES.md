# Notes: my design log

**Live URL (Vercel):** https://lab-tech-shop-five.vercel.app/
## 1. Route and storage choice

- I used the existing route at /premium because the navbar already points there, and the README calls this out as the payment page.
- I stored the premium flag in localStorage under the key techcart-premium. That is the right choice here because the flag must survive refreshes and future visits, unlike sessionStorage which disappears when the tab is closed.
- A cookie would also work in theory, but localStorage is simpler for this mock checkout and keeps the browser-side state close to the UI logic.

## 2. Server vs Client Components

- app/page.js: Server Component. It only renders product data.
- app/layout.js: Server Component. It composes the shell and passes children through.
- app/components/Navbar.js: Server/structural component; it just renders links.
- app/components/AdBanner.js: Client Component because it uses useEffect, browser storage, and UI state for the premium flag.
- app/premium/page.js: Client Component because it holds form state, handles submit events, and reads/writes localStorage.
- Keeping the product page and layout on the server keeps the data rendering path simple and avoids unnecessary client-side overhead. The browser-only logic is isolated to the premium and ad components, which is exactly where it belongs.

## 3. The first-render problem

- The main risk here is a hydration mismatch: the server renders the ad banner before the browser has read localStorage, so the first paint could disagree with the client. I avoided that by keeping the initial premium state explicit and then syncing it in useEffect after mount.
- The premium page also uses an isReady guard so the form is not rendered until the browser has checked localStorage. That prevents the server/client render mismatch and avoids a window-not-defined error on first paint.
- I verified the behavior by submitting the mock payment, reloading the home page, and confirming in the browser that both ad elements stayed hidden after the refresh.

## 4. How the pieces connect

The user fills out the mock checkout and submits it on /premium. The handler validates the inputs, writes true to localStorage, and updates the UI to show the confirmation state. The ad banner listens for that premium flag on the next render and hides both ads; because the flag is stored in the browser, the same page reloads with the ads still gone.

## 5. If I had another hour

- I would add a small "Restore ads" action that clears the premium flag and lets the user toggle the experience back on. It would make the mock payment flow feel more complete and give the UI a simple reset path.
