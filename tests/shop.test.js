import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCart,
  normalizeSaved,
  normalizeOrder,
  updateQuantity,
  totals,
  filterProducts,
  readStored,
  writeStored,
} from "../src/lib/shop.js";
import { products } from "../src/data/products.js";

test("untrusted cart storage only accepts real products and positive integer quantities", () => {
  assert.deepEqual(normalizeCart(null), []);
  assert.deepEqual(
    normalizeCart([
      null,
      {},
      { id: "toString", quantity: 1 },
      { id: "__proto__", quantity: 2 },
      { id: "daily-mug", quantity: "2" },
      { id: "daily-mug", quantity: 0 },
      { id: "daily-mug", quantity: 1.5 },
    ]),
    [],
  );
  assert.deepEqual(
    normalizeCart([
      { id: "daily-mug", quantity: 5, price: 1 },
      { id: "daily-mug", quantity: 6 },
    ]),
    [{ id: "daily-mug", quantity: 8 }],
  );
  assert.deepEqual(
    normalizeSaved(["daily-mug", "daily-mug", "toString", null, {}]),
    ["daily-mug"],
  );
});
test("quantity changes clamp at limit and removal empties bag", () => {
  const cart = updateQuantity([], "arc-lamp", 900);
  assert.deepEqual(cart, [{ id: "arc-lamp", quantity: 5 }]);
  assert.deepEqual(updateQuantity(cart, "arc-lamp", 0), []);
});
test("prices are derived from catalogue in paise and shipping follows threshold", () => {
  assert.deepEqual(totals([]), {
    subtotal: 0,
    shipping: 0,
    total: 0,
    count: 0,
  });
  assert.deepEqual(totals([{ id: "arc-lamp", quantity: 1, price: 1 }]), {
    subtotal: 249900,
    shipping: 14900,
    total: 264800,
    count: 1,
  });
  assert.deepEqual(
    totals([
      { id: "arc-lamp", quantity: 1 },
      { id: "daily-mug", quantity: 1 },
    ]),
    { subtotal: 319800, shipping: 0, total: 319800, count: 2 },
  );
});
test("search, category, price, and sorting compose without mutating catalogue", () => {
  const ids = products.map((p) => p.id);
  assert.equal(
    filterProducts(products, { search: "  MUG  " })[0].id,
    "daily-mug",
  );
  assert.deepEqual(
    filterProducts(products, { search: "mug", category: "Workspace" }),
    [],
  );
  const filtered = filterProducts(products, {
    budget: 100000,
    sort: "price-low",
  });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((p) => p.price <= 100000));
  assert.deepEqual(
    filtered.map((p) => p.price),
    filtered.map((p) => p.price).sort((a, b) => a - b),
  );
  assert.deepEqual(
    products.map((p) => p.id),
    ids,
  );
});
test("order normalization drops delivery data and rejects invalid orders", () => {
  const order = {
    id: "FF-ABC123",
    createdAt: "2026-10-18T12:00:00.000Z",
    items: [{ id: "daily-mug", quantity: 1 }],
    email: "private@example.com",
  };
  assert.deepEqual(Object.keys(normalizeOrder(order)), [
    "id",
    "createdAt",
    "items",
  ]);
  assert.equal(normalizeOrder({ ...order, createdAt: "invalid" }), null);
  assert.equal(normalizeOrder({ ...order, items: [] }), null);
});
test("unavailable or corrupt browser storage fails safely", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => "{bad",
      setItem: () => {
        throw new Error("denied");
      },
    },
  });
  try {
    assert.deepEqual(readStored("cart", []), []);
    assert.equal(writeStored("cart", []), false);
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", previous);
    else delete globalThis.localStorage;
  }
});
