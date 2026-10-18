import { productById } from "../data/products.js";
export const CART_KEY = "form-field-cart-v1";
export const SAVED_KEY = "form-field-saved-v1";
export const ORDER_KEY = "form-field-order-v1";
export const FREE_SHIPPING = 300000;
export const SHIPPING = 14900;
export const money = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: paise % 100 ? 2 : 0,
  }).format(paise / 100);
export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  const merged = new Map();
  for (const item of value) {
    const p =
      typeof item?.id === "string" && Object.hasOwn(productById, item.id)
        ? productById[item.id]
        : null;
    if (!p || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    merged.set(
      p.id,
      Math.min(p.limit, (merged.get(p.id) || 0) + item.quantity),
    );
  }
  return [...merged].map(([id, quantity]) => ({ id, quantity }));
}
export function normalizeSaved(value) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id) => typeof id === "string" && Object.hasOwn(productById, id),
          ),
        ),
      ]
    : [];
}
export function updateQuantity(cart, id, quantity) {
  const rest = cart.filter((item) => item.id !== id);
  return normalizeCart(quantity > 0 ? [...rest, { id, quantity }] : rest);
}
export function totals(cart) {
  const items = normalizeCart(cart);
  const subtotal = items.reduce(
    (n, item) => n + productById[item.id].price * item.quantity,
    0,
  );
  const shipping = subtotal && subtotal < FREE_SHIPPING ? SHIPPING : 0;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    count: items.reduce((n, item) => n + item.quantity, 0),
  };
}
export function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function filterProducts(
  products,
  { search = "", category = "All objects", sort = "featured", budget = 0 },
) {
  const result = products.filter(
    (p) =>
      (category === "All objects" || p.category === category) &&
      (!budget || p.price <= budget) &&
      `${p.name} ${p.category} ${p.color}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "featured")
    result.sort((a, b) => Number(b.featured) - Number(a.featured));
  return result;
}
export function normalizeOrder(value) {
  if (
    !value ||
    typeof value.id !== "string" ||
    !/^FF-[A-Z0-9-]+$/.test(value.id) ||
    !Number.isFinite(Date.parse(value.createdAt))
  )
    return null;
  const items = normalizeCart(value.items);
  return items.length
    ? { id: value.id, createdAt: value.createdAt, items }
    : null;
}
