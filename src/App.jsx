import { useState, useEffect, useSyncExternalStore } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Icon from "./components/Icon";
import {
  Hero,
  ProductPage,
  CartPage,
  CheckoutPage,
  OrderPage,
  AboutPage,
  Empty,
} from "./components/ShopPages";
import { categories, productById } from "./data/products";
import {
  CART_KEY,
  SAVED_KEY,
  ORDER_KEY,
  normalizeCart,
  normalizeSaved,
  normalizeOrder,
  readStored,
  writeStored,
  updateQuantity,
  totals,
} from "./lib/shop";
import "./App.css";
const subscribe = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const snapshot = () => window.location.hash.slice(1) || "/shop";
export default function App() {
  const location = useSyncExternalStore(subscribe, snapshot);
  const [route, query = ""] = location.split("?");
  const params = new URLSearchParams(query);
  const requested = params.get("category");
  const category = categories.includes(requested) ? requested : "All objects";
  const [cart, setCart] = useState(() =>
    normalizeCart(readStored(CART_KEY, [])),
  );
  const [saved, setSaved] = useState(() =>
    normalizeSaved(readStored(SAVED_KEY, [])),
  );
  const [order, setOrder] = useState(() =>
    normalizeOrder(readStored(ORDER_KEY, null)),
  );
  const [notice, setNotice] = useState(null);
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    document.title = `${route.startsWith("/product/") ? productById[route.split("/")[2]]?.name || "Object" : { "/shop": "Considered objects for everyday living", "/cart": "Your bag", "/saved": "Your favourites", "/checkout": "Demo checkout", "/order": "Demo confirmation", "/about": "Our story" }[route] || "Page not found"} — Form & Field`;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
    if (route === "/shop" && query)
      requestAnimationFrame(() =>
        document
          .getElementById("collection")
          ?.scrollIntoView({ block: "start" }),
      );
  }, [location, route, query]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    function sync(event) {
      if (event.key === CART_KEY)
        setCart(normalizeCart(readStored(CART_KEY, [])));
      if (event.key === SAVED_KEY)
        setSaved(normalizeSaved(readStored(SAVED_KEY, [])));
      if (event.key === ORDER_KEY)
        setOrder(normalizeOrder(readStored(ORDER_KEY, null)));
      if (event.key === null) {
        setCart([]);
        setSaved([]);
        setOrder(null);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function saveCart(next) {
    setCart(next);
    if (!writeStored(CART_KEY, next)) setStorageFailed(true);
  }
  function add(id, quantity = 1) {
    const p = productById[id];
    if (!p) return;
    const current = cart.find((i) => i.id === id)?.quantity || 0;
    if (current + quantity > p.limit) {
      setNotice({
        text: `You can add up to ${p.limit} of this object in the demo.`,
      });
      return;
    }
    saveCart(updateQuantity(cart, id, current + quantity));
    setNotice({ text: `${p.name} added to your bag.`, bag: true });
  }
  function toggleSaved(id) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    if (!writeStored(SAVED_KEY, next)) setStorageFailed(true);
    setNotice({
      text: next.includes(id)
        ? "Saved for a little later."
        : "Removed from saved items.",
    });
  }
  function complete() {
    if (!cart.length) return;
    const next = {
      id: `FF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: cart,
    };
    setOrder(next);
    if (!writeStored(ORDER_KEY, next)) setStorageFailed(true);
    saveCart([]);
    window.location.hash = "/order";
  }
  const shopProps = { cart, saved, onAdd: add, onSave: toggleSaved };
  let page;
  if (route === "/shop")
    page = (
      <main>
        <Hero />
        <div className="page-wrap">
          <ProductList
            key={location}
            {...shopProps}
            initialCategory={category}
          />
          <section className="editorial">
            <span className="editorial-mark">&</span>
            <div>
              <p className="eyebrow">FEWER THINGS. MORE MEANING.</p>
              <h2>
                Make room for
                <br />
                <em>the everyday good.</em>
              </h2>
              <a href="#/about" className="text-link">
                A little about us <Icon name="arrow" size={17} />
              </a>
            </div>
            <p>
              For the first cup of the morning.
              <br />
              The ideas that come after.
              <br />
              And the spaces in between.
            </p>
          </section>
        </div>
      </main>
    );
  else if (route === "/saved")
    page = (
      <main className="page-wrap">
        <ProductList key="saved" {...shopProps} savedOnly />
      </main>
    );
  else if (/^\/product\/[^/]+$/.test(route))
    page = <ProductPage key={route} id={route.split("/")[2]} {...shopProps} />;
  else if (route === "/cart")
    page = (
      <CartPage
        cart={cart}
        onQuantity={(id, q) => saveCart(updateQuantity(cart, id, q))}
        onRemove={(id) => {
          saveCart(updateQuantity(cart, id, 0));
          setNotice({ text: "Object removed from your bag." });
        }}
      />
    );
  else if (route === "/checkout")
    page = <CheckoutPage cart={cart} onComplete={complete} />;
  else if (route === "/order") page = <OrderPage order={order} />;
  else if (route === "/about") page = <AboutPage />;
  else
    page = (
      <Empty
        title="We took a wrong turn."
        text="This page doesn’t exist. The collection is a good place to start."
      />
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar
        route={route}
        count={totals(cart).count}
        savedCount={saved.length}
      />
      {storageFailed && (
        <div className="storage-warning" role="alert">
          Your browser couldn’t save this change. You can continue shopping, but
          changes may be lost after refresh.
        </div>
      )}
      <div id="main-content" tabIndex={-1}>
        {page}
      </div>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="wordmark" href="#/shop">
            form <i>&</i> field<span>•</span>
          </a>
          <p>
            Good objects.
            <br />
            Better everyday moments.
          </p>
          <nav aria-label="Footer navigation">
            <a href="#/shop">The collection</a>
            <a href="#/about">About this demo</a>
            <a href="#/saved">Saved objects</a>
            <a href="#/cart">Your bag</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Form & Field · A portfolio concept
          </span>
          <span>React storefront · No real transactions</span>
        </div>
      </footer>
      <div className="toast-area" role="status" aria-live="polite">
        {notice && (
          <div className="toast">
            <Icon name="check" size={18} />
            <span>{notice.text}</span>
            {notice.bag && <a href="#/cart">View bag →</a>}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice(null)}
            >
              <Icon name="close" size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
