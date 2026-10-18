import { useState, useRef } from "react";
import Icon from "./Icon";
import ProductCard from "./ProductCard";
import { products, productById } from "../data/products";
import { money, totals, FREE_SHIPPING } from "../lib/shop";
export function Hero() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> THE ART OF EVERYDAY LIVING
          </p>
          <h1>
            A little less.
            <br />
            <em>A little better.</em>
          </h1>
          <p>
            Good design doesn’t need to shout.
            <br />
            Discover simple objects that make the everyday feel a little more
            considered.
          </p>
          <a className="button" href="#/shop?collection=all">
            Explore the collection <Icon name="arrow" size={19} />
          </a>
          <div className="hero-footnote">
            <span className="tiny-star">✳</span>
            <span>
              Small details.
              <br />
              <strong>A different kind of everyday.</strong>
            </span>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/art/hero.svg"
            alt="Original illustration of an orange desk lamp, blue notebook, and ceramic mug on a sunlit desk"
            width="720"
            height="680"
            fetchPriority="high"
          />
          <span className="hero-stamp">
            LESS, BUT
            <br />
            <i>lovelier.</i>
          </span>
          <a className="hero-caption" href="#/shop?category=Workspace">
            <span>
              <small>A SPACE TO MAKE THINGS</small>
              <b>The desk edit</b>
            </span>
            <span className="round-arrow">
              <Icon name="arrow" />
            </span>
          </a>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Icon name="sun" />
          For the everyday rituals
        </span>
        <span>
          <Icon name="box" />
          Thoughtful shapes & useful things
        </span>
        <span>
          <Icon name="leaf" />A little room for simplicity
        </span>
      </div>
    </>
  );
}
export function Quantity({ product, quantity, onChange }) {
  return (
    <div className="quantity">
      <button
        aria-label={`Decrease ${product.name} quantity`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Icon name="minus" size={14} />
      </button>
      <span aria-label={`${product.name} quantity`}>{quantity}</span>
      <button
        aria-label={`Increase ${product.name} quantity`}
        disabled={quantity >= product.limit}
        onClick={() => onChange(quantity + 1)}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
export function ProductPage({ id, cart, onAdd, saved, onSave }) {
  const p = Object.hasOwn(productById, id) ? productById[id] : null;
  const [quantity, setQuantity] = useState(1);
  if (!p)
    return (
      <Empty
        title="That object isn't in our collection."
        text="Explore the collection to find something else."
      />
    );
  const already = cart.find((i) => i.id === p.id)?.quantity || 0,
    remaining = p.limit - already;
  return (
    <main className="page-wrap">
      <div className="breadcrumbs">
        <a href="#/shop?collection=all">Collection</a>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <section className="product-detail">
        <div className="detail-art" style={{ background: p.background }}>
          <span className="product-tag">{p.category}</span>
          <img
            src={`/art/${p.art}.svg`}
            alt={p.name}
            width="480"
            height="480"
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">A FORM & FIELD ORIGINAL CONCEPT</p>
          <h1>{p.name}</h1>
          <p className="detail-price">{money(p.price)}</p>
          <p className="detail-description">{p.description}</p>
          <div className="color-choice">
            <span style={{ background: p.background }} />
            Colour: <strong>{p.color}</strong>
          </div>
          <div className="detail-buy">
            <Quantity product={p} quantity={quantity} onChange={setQuantity} />
            <button
              className="button"
              disabled={remaining < quantity}
              onClick={() => onAdd(p.id, quantity)}
            >
              <Icon name="bag" size={18} />
              {remaining === 0 ? "Bag limit reached" : "Add to bag"}{" "}
              <span>{money(p.price * quantity)}</span>
            </button>
            <button
              className={`detail-save ${saved.includes(p.id) ? "is-saved" : ""}`}
              onClick={() => onSave(p.id)}
              aria-pressed={saved.includes(p.id)}
              aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
            >
              <Icon name="heart" />
            </button>
          </div>
          <p className="field-note">
            {already ? `${already} already in your bag. ` : ""}Up to {p.limit}{" "}
            per object in this demo.
            {quantity > remaining && remaining > 0
              ? ` Choose ${remaining} or fewer to add.`
              : ""}
          </p>
          <details open>
            <summary>The details</summary>
            <ul>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <details>
            <summary>Demo delivery & returns</summary>
            <p>
              Shipping is simulated at ₹149, or free for a bag subtotal of
              ₹3,000 or more. No products are shipped, payments taken, or return
              requests created. Product specifications are fictional demo
              content.
            </p>
          </details>
          <p className="demo-note">
            Portfolio demo · Illustrated concept product · No real sale
          </p>
        </div>
      </section>
      <section className="related">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BETTER TOGETHER</p>
            <h2>A few more good things.</h2>
          </div>
          <a className="text-link" href="#/shop?collection=all">
            See all objects <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="products-grid related-grid">
          {products
            .filter((x) => x.id !== p.id)
            .sort(
              (a, b) =>
                Number(b.category === p.category) -
                Number(a.category === p.category),
            )
            .slice(0, 3)
            .map((x) => (
              <ProductCard
                key={x.id}
                product={x}
                onAdd={onAdd}
                onSave={onSave}
                saved={saved.includes(x.id)}
                quantity={cart.find((i) => i.id === x.id)?.quantity || 0}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
export function Empty({ title, text }) {
  return (
    <main className="page-wrap">
      <div className="empty-state large">
        <span className="empty-symbol">
          <Icon name="bag" size={37} />
        </span>
        <p className="eyebrow">ROOM FOR SOMETHING GOOD</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <a className="button" href="#/shop?collection=all">
          Explore the collection <Icon name="arrow" size={17} />
        </a>
      </div>
    </main>
  );
}
export function Summary({ cart, children }) {
  const t = totals(cart);
  return (
    <aside className="order-summary">
      <p className="eyebrow">THE LITTLE DETAILS</p>
      <h2>Bag summary</h2>
      <dl>
        <div>
          <dt>
            Subtotal ({t.count} {t.count === 1 ? "item" : "items"})
          </dt>
          <dd>{money(t.subtotal)}</dd>
        </div>
        <div>
          <dt>Demo shipping</dt>
          <dd>{t.shipping ? money(t.shipping) : "Free"}</dd>
        </div>
      </dl>
      <div className="summary-total">
        <strong>Total</strong>
        <strong>{money(t.total)}</strong>
      </div>
      <p className="field-note">
        Demo prices only. No payment or tax invoice is created.
      </p>
      {children}
      <p className="safe-note">
        <Icon name="check" size={15} /> No card details. No real charge.
      </p>
    </aside>
  );
}
export function CartPage({ cart, onQuantity, onRemove }) {
  const t = totals(cart);
  if (!cart.length)
    return (
      <Empty
        title="A little room in your bag."
        text="Your next favourite object is waiting in the collection."
      />
    );
  return (
    <main className="page-wrap">
      <div className="page-heading">
        <p className="eyebrow">GOOD CHOICES, ALL IN ONE PLACE</p>
        <h1>
          Your shopping bag<span> ({t.count})</span>
        </h1>
        <a href="#/shop?collection=all" className="text-link">
          ← Keep exploring
        </a>
      </div>
      <div className="checkout-layout">
        <section className="bag-items" aria-label="Shopping bag items">
          <div className="shipping-progress">
            <p>
              {t.subtotal >= FREE_SHIPPING ? (
                "Your demo bag qualifies for free shipping."
              ) : (
                <>
                  You’re {money(FREE_SHIPPING - t.subtotal)} away from free demo
                  shipping.
                </>
              )}
            </p>
            <progress
              aria-label="Progress toward free demo shipping"
              max={FREE_SHIPPING}
              value={Math.min(t.subtotal, FREE_SHIPPING)}
            />
          </div>
          {cart.map((item) => {
            const p = productById[item.id];
            return (
              <article className="bag-item" key={item.id}>
                <a
                  className="bag-image"
                  href={`#/product/${p.id}`}
                  style={{ background: p.background }}
                >
                  <img
                    src={`/art/${p.art}.svg`}
                    alt={p.name}
                    width="130"
                    height="130"
                  />
                </a>
                <div className="bag-description">
                  <p className="eyebrow">{p.category}</p>
                  <h2>
                    <a href={`#/product/${p.id}`}>{p.name}</a>
                  </h2>
                  <p>
                    {p.color} · {money(p.price)} each
                  </p>
                  <div className="bag-controls">
                    <Quantity
                      product={p}
                      quantity={item.quantity}
                      onChange={(q) => onQuantity(p.id, q)}
                    />
                    <button
                      className="remove-button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => onRemove(p.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="line-total">
                  {money(p.price * item.quantity)}
                </strong>
              </article>
            );
          })}
        </section>
        <Summary cart={cart}>
          <a className="button" href="#/checkout">
            Continue to demo checkout <Icon name="arrow" size={17} />
          </a>
        </Summary>
      </div>
    </main>
  );
}
const sample = {
  name: "Alex Example",
  email: "alex@example.com",
  address: "12 Sample Lane",
  city: "Jaipur",
  postal: "302001",
};
export function CheckoutPage({ cart, onComplete }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  if (!cart.length)
    return (
      <Empty
        title="Your bag is empty."
        text="Add an object before starting the demo checkout."
      />
    );
  function submit(e) {
    e.preventDefault();
    if (lock.current) return;
    if (Object.values(form).some((v) => !v.trim())) {
      setError("Complete all delivery fields using sample details.");
      return;
    }
    lock.current = true;
    setBusy(true);
    onComplete();
  }
  return (
    <main className="page-wrap">
      <div className="page-heading">
        <a href="#/cart" className="text-link">
          ← Back to bag
        </a>
        <p className="eyebrow">ONE LAST LITTLE STEP</p>
        <h1>Try the checkout.</h1>
      </div>
      <div className="checkout-layout">
        <form id="checkout-form" onSubmit={submit} className="checkout-form">
          <div className="demo-banner">
            <Icon name="box" />
            <div>
              <strong>This is a demo, not a purchase.</strong>
              <p>
                Please use fictional details. Nothing is sent to a server, no
                payment is collected, and no goods will be delivered.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setForm(sample);
                  setError("");
                }}
              >
                Use sample details <Icon name="arrow" size={16} />
              </button>
            </div>
          </div>
          <div className="form-title">
            <span>01</span>
            <h2>Demo delivery details</h2>
          </div>
          <div className="form-grid">
            {[
              ["name", "Full name", "text", "Alex Example"],
              ["email", "Email address", "email", "alex@example.com"],
              ["address", "Street address", "text", "12 Sample Lane"],
              ["city", "City", "text", "Jaipur"],
              ["postal", "PIN code", "text", "302001"],
            ].map(([key, label, type, placeholder]) => (
              <label
                key={key}
                className={key === "address" ? "full-width" : ""}
              >
                {label}
                <input
                  name={key}
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  maxLength={key === "postal" ? 6 : 150}
                  pattern={key === "postal" ? "[1-9][0-9]{5}" : undefined}
                  inputMode={key === "postal" ? "numeric" : undefined}
                  autoComplete="off"
                  placeholder={placeholder}
                />
              </label>
            ))}
          </div>
          <div className="form-title">
            <span>02</span>
            <h2>Payment</h2>
          </div>
          <div className="demo-payment">
            <Icon name="check" />
            <div>
              <strong>Demo mode — no payment required</strong>
              <p>See a confirmation without entering card or bank details.</p>
            </div>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </form>
        <Summary cart={cart}>
          <div className="checkout-mini-items">
            {cart.map((item) => (
              <p key={item.id}>
                <span>
                  {productById[item.id].name} × {item.quantity}
                </span>
                <b>{money(productById[item.id].price * item.quantity)}</b>
              </p>
            ))}
          </div>
          <button
            className="button"
            form="checkout-form"
            type="submit"
            disabled={busy}
          >
            {busy ? "Creating demo…" : "Place demo order"}
            <Icon name="arrow" size={17} />
          </button>
        </Summary>
      </div>
    </main>
  );
}
export function OrderPage({ order }) {
  if (!order)
    return (
      <Empty
        title="No demo order to show yet."
        text="Complete the demo checkout to see how an order confirmation works."
      />
    );
  const t = totals(order.items);
  return (
    <main className="page-wrap">
      <section className="confirmation">
        <span className="confirmation-check">
          <Icon name="check" size={35} />
        </span>
        <p className="eyebrow">A LITTLE MOMENT OF SATISFACTION</p>
        <h1>
          Looking good.
          <br />
          <em>Your demo is complete.</em>
        </h1>
        <p>
          No payment was taken. No products will be shipped.
          <br />
          This confirmation is saved only in this browser; delivery details are
          not saved.
        </p>
        <div className="order-meta">
          <span>
            DEMO ORDER
            <br />
            <strong>{order.id}</strong>
          </span>
          <span>
            CREATED
            <br />
            <strong>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </span>
        </div>
        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.id}>
              <img
                src={`/art/${productById[item.id].art}.svg`}
                alt=""
                width="65"
                height="65"
                style={{ background: productById[item.id].background }}
              />
              <span>
                {productById[item.id].name}
                <small>Quantity {item.quantity}</small>
              </span>
              <strong>
                {money(productById[item.id].price * item.quantity)}
              </strong>
            </div>
          ))}
          <p>
            <span>Demo shipping</span>
            <strong>{t.shipping ? money(t.shipping) : "Free"}</strong>
          </p>
          <p className="confirmation-total">
            <span>Demo total</span>
            <strong>{money(t.total)}</strong>
          </p>
        </div>
        <a className="button" href="#/shop?collection=all">
          Back to the collection <Icon name="arrow" size={18} />
        </a>
      </section>
    </main>
  );
}
export function AboutPage() {
  return (
    <main className="page-wrap">
      <section className="about-intro">
        <p className="eyebrow">THE IDEA BEHIND FORM & FIELD</p>
        <h1>
          Everyday objects.
          <br />
          <em>A little more intention.</em>
        </h1>
        <p>
          A fictional design shop built to demonstrate a real shopping flow.
          From discovering an object to checking out, the details should feel
          simple, useful, and considered.
        </p>
      </section>
      <section className="about-grid">
        <img
          src="/art/hero.svg"
          alt="Illustrated Form and Field desk collection"
          width="720"
          height="680"
        />
        <div>
          <p className="eyebrow">A SMALL SHOP. A COMPLETE EXPERIENCE.</p>
          <h2>
            Built with care,
            <br />
            for the sake of learning.
          </h2>
          <p>
            This is a React portfolio project. The products, descriptions,
            prices, delivery rules, and illustrations are demonstration content,
            not commercial offers.
          </p>
          <p>
            You can browse, search, save favourites, build a bag, and complete a
            demo checkout. The cart, favourites, and latest demo confirmation
            stay on this device. There is no account system, payment processing,
            or order fulfilment.
          </p>
          <a href="#/shop" className="text-link">
            Find something you like <Icon name="arrow" size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
