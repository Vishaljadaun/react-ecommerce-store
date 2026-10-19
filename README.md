# Form & Field

[Open the live demo](https://form-field-store.onrender.com) · [Automated checks](https://github.com/Vishaljadaun/react-ecommerce-store/actions)

A responsive React storefront for a fictional collection of everyday objects. This project takes a small product-list demo through the complete frontend shopping journey: discovery, product details, favourites, a persistent bag, and a simulated checkout.

**Portfolio demo only:** no real purchases, payment processing, inventory reservation, customer accounts, or fulfilment. Products, specifications, prices, and delivery rules are fictional. Use the sample delivery details in checkout.

## What works

- **Catalogue:** ten bundled concept products with original SVG illustrations; no product API or external image dependency.
- **Discovery:** search by name/category/colour; category and maximum-price filters; featured, price, and name sorting; filter reset and useful empty states.
- **Product pages:** descriptions, details, colour, quantity selection, related products, saved items, and bag limits.
- **Shopping bag:** add, remove, change quantities, calculate line totals, and show progress towards free demo shipping.
- **Favourites:** save/unsave objects and revisit them on a dedicated page.
- **Demo checkout:** required fields, email and Indian PIN validation, one-click fictional sample details, order confirmation, and bag reset.
- **Persistence:** bag, saved product IDs, and latest demo confirmation survive refresh in the same browser. Changes sync between tabs through storage events.
- **Resilience:** malformed stored data is normalized; unknown products and invalid quantities are discarded; duplicate cart entries merge within per-product limits. Storage failures display a warning while allowing the current session to continue.
- **Responsive UI:** warm editorial styling, mobile navigation, accessible names, visible keyboard focus, a skip link, status announcements, reduced-motion support, and explicit empty/not-found states.

## Technology and why it is used

| Technology                           | Role                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| React 19 / React DOM                 | Component rendering, state, forms, and reactive page updates                     |
| Vite 7                               | Development server and optimized static production build                         |
| JavaScript ES modules                | Small, readable frontend implementation without a backend requirement            |
| CSS                                  | Responsive grids, design tokens, typography, transitions, and interaction states |
| Original SVG illustrations           | Scalable local artwork that stays sharp on mobile and desktop                    |
| Hash URLs and `useSyncExternalStore` | Lightweight route handling with refresh-safe static hosting                      |
| Browser `localStorage`               | Device-local demo bag, favourites, and latest confirmation                       |
| `Intl.NumberFormat`                  | Indian rupee display using integer paise for calculation                         |
| Node test runner                     | Unit tests for normalization, limits, totals, filtering, and storage failures    |
| Playwright                           | Desktop/mobile browser checks of the shopping journey and layout                 |
| ESLint / GitHub Actions              | Automated lint, test, build, and browser checks                                  |

The catalogue is deliberately bundled. This keeps a portfolio demonstration reproducible even when third-party catalogue services are unavailable. The storefront does not fetch live stock, reviews, or prices.

## Run locally

Use **Node.js 22.12+** (CI uses Node 22) and npm.

```bash
git clone https://github.com/Vishaljadaun/react-ecommerce-store.git
cd react-ecommerce-store
npm ci
npm run dev
```

Open the URL printed by Vite. No environment variables, database, credentials, or API keys are required.

| Command            | Purpose                              |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Local development server             |
| `npm run build`    | Create production assets in `dist/`  |
| `npm run preview`  | Inspect the production build locally |
| `npm run lint`     | Check source and test code           |
| `npm test`         | Run pure business-logic tests        |
| `npm run test:e2e` | Run desktop and mobile browser tests |

Install the browser once before running browser tests:

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

GitHub Actions performs all these checks and retains browser screenshots, traces on failure, and the HTML report as an artifact for seven days.

## Try the complete flow

1. Search for an object, change a category, or sort by price.
2. Save a favourite, open Saved, and refresh to see persistence.
3. Open **Arc desk lamp**, add one to the bag, then view the bag.
4. Change the quantity to two. Demo shipping becomes free.
5. Refresh: the bag remains. Continue to demo checkout.
6. Click **Use sample details**, then **Place demo order**.
7. The confirmation appears and the bag is cleared. Refresh to see the latest confirmation again.

All amounts are illustrative INR values. Shipping is ₹149 for a nonempty bag below ₹3,000, and free at ₹3,000 or above. An empty bag has no shipping charge. Each product has a fixed demo quantity limit; this is not real stock control.

## Project structure

```text
src/
  App.jsx                    Hash routes and shared application state
  App.css                    Page and component styles
  index.css                  Base styles and accessibility defaults
  components/
    Navbar.jsx               Navigation and bag/saved counts
    ProductList.jsx          Search, filters, sorting, and empty states
    ProductCard.jsx          Product links, save, and quick add
    ShopPages.jsx            Product, bag, checkout, confirmation, and story
    Icon.jsx                 Reusable inline SVG icons
  data/products.js            Fictional catalogue and categories
  lib/shop.js                Normalization, totals, storage, and filtering
public/art/                  Original SVG product and hero illustrations
tests/shop.test.js           Pure logic tests
e2e/shop.spec.js             Browser journeys and responsive screenshots
.github/workflows/ci.yml     Continuous integration
```

Routes are `#/shop`, `#/product/:id`, `#/saved`, `#/cart`, `#/checkout`, `#/order`, and `#/about`. Category links use `#/shop?category=Workspace`. Unknown routes and unknown products show a recovery link.

## Data and privacy boundaries

The app uses three versioned storage keys:

| Key                   | Stored content                                               |
| --------------------- | ------------------------------------------------------------ |
| `form-field-cart-v1`  | Product IDs and quantities                                   |
| `form-field-saved-v1` | Saved product IDs                                            |
| `form-field-order-v1` | Latest demo reference, timestamp, and product IDs/quantities |

Delivery form values exist only in React memory. They are not included in the confirmation, written to local storage, or submitted to a server. There are no card fields. Normal browser hosting requests still occur to download the site assets.

Local storage is editable by the visitor and is **not a trusted order system**. The latest confirmation derives amounts from the current bundled catalogue; it is not a historical invoice. There is no cross-device synchronization, order history, account recovery, or guaranteed data retention. Clearing site data removes the demo state. Private browsing or blocked storage may prevent persistence.

## Static deployment

Deploy as a **static site**, not a backend web service:

- Repository: `Vishaljadaun/react-ecommerce-store`
- Branch: `main`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node version: 22.12 or newer in the Node 22 series
- Environment variables: none required

Hash routing does not require an SPA rewrite. Assets assume deployment at the domain root; a GitHub Pages project subdirectory would require a Vite base-path and asset-path adjustment. Render or Vercel at the root of a site domain fits the current configuration.

## Future development roadmap

This version is complete as a **frontend portfolio demo**. A real commerce service would need additional systems; these are planned ideas, not current features.

1. **Backend catalogue and inventory:** database schema, product management, image uploads, server-side validation, pagination, stock reservations, and concurrency protection.
2. **Accounts and persistent customer data:** secure authentication, authorization, saved bags across devices, address management, and explicit retention/deletion controls.
3. **Real order domain:** server-authoritative prices, currency/tax/shipping rules, immutable price snapshots, order history, idempotency, and order status tracking.
4. **Payments in a sandbox first:** provider-hosted checkout, verified webhooks, duplicate-event handling, refunds, and reconciliation. Never trust a browser confirmation as proof of payment.
5. **Admin and fulfilment:** role-protected product/order tools, stock adjustments, audit history, shipment integrations, and customer notifications.
6. **Experience and quality:** product variants, richer imagery, comparison, automated accessibility auditing, performance budgets, and more browser/device coverage.
7. **Production operations:** monitoring, security headers, dependency maintenance, backups, recovery procedures, abuse controls, and privacy/legal content appropriate to the actual business.

Build these incrementally. Keep payment and personal-data flows in a controlled test environment until the server-side and operational requirements are ready.
