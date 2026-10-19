# Form & Field

A responsive React ecommerce portfolio demo with a complete frontend shopping flow.

**[Live demo](https://form-field-store.onrender.com)**

## Features

- Product catalogue, details, search, filters, and sorting
- Favourites and shopping cart saved in the browser
- Quantity controls, totals, and simulated shipping
- Demo checkout with sample details and order confirmation
- Responsive layouts for mobile and desktop

## Tech stack

React 19, Vite 7, JavaScript, CSS, SVG illustrations, and localStorage. Testing uses Node's test runner, Playwright, ESLint, and GitHub Actions. Hosted on Render.

## Run locally

Use Node.js 22.12+ and npm.

```bash
git clone https://github.com/Vishaljadaun/react-ecommerce-store.git
cd react-ecommerce-store
npm ci
npm run dev
```

Checks: `npm run lint`, `npm test`, and `npm run build`.

## Demo scope

Products and prices are fictional. There is no backend, account system, real payment, or delivery. Use **Use sample details** at checkout. Cart and favourites stay in this browser; delivery details are not saved or sent to a server.

## Future improvements

Backend and database, secure login, inventory integration, order history, and payment-provider sandbox checkout.
