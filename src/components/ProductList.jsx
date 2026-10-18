import { useState } from "react";
import ProductCard from "./ProductCard";
import Icon from "./Icon";
import { products, categories } from "../data/products";
import { filterProducts } from "../lib/shop";
export default function ProductList({
  onAdd,
  saved,
  onSave,
  cart,
  initialCategory = "All objects",
  savedOnly = false,
}) {
  const [category, setCategory] = useState(initialCategory),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState("featured"),
    [budget, setBudget] = useState(0);
  const source = savedOnly
    ? products.filter((p) => saved.includes(p.id))
    : products;
  const visible = filterProducts(source, { category, search, sort, budget });
  function reset() {
    setCategory("All objects");
    setSearch("");
    setBudget(0);
    setSort("featured");
  }
  return (
    <section id="collection" className="collection">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {savedOnly
              ? "KEEP THE GOOD THINGS CLOSE"
              : "THE EVERYDAY COLLECTION"}
          </p>
          <h2>
            {savedOnly ? "Your favourites." : "Good things. Simple pleasures."}
          </h2>
        </div>
        <p>
          {savedOnly
            ? "A little collection of things you love."
            : "Thoughtfully imagined objects for your space and your pace."}
        </p>
      </div>
      <div className="shop-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label="Product categories"
        >
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <label className="search-box">
            <Icon name="search" size={18} />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Find something good…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="select-filter">
            Price
            <select
              aria-label="Maximum price"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            >
              <option value={0}>All prices</option>
              <option value={100000}>Up to ₹1,000</option>
              <option value={200000}>Up to ₹2,000</option>
              <option value={300000}>Up to ₹3,000</option>
            </select>
          </label>
          <label className="select-filter">
            Sort by
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
      </div>
      <p className="result-count" role="status">
        {visible.length} {visible.length === 1 ? "object" : "objects"}
        {search && ` matching “${search}”`}
      </p>
      {visible.length ? (
        <div className="products-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={onAdd}
              saved={saved.includes(p.id)}
              onSave={onSave}
              quantity={cart.find((i) => i.id === p.id)?.quantity || 0}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name={savedOnly ? "heart" : "search"} size={40} />
          <h3>
            {savedOnly && !source.length
              ? "Make a little wishlist."
              : "Nothing here just yet."}
          </h3>
          <p>
            {savedOnly && !source.length
              ? "Tap the heart on an object to save it for later."
              : "Try another search, category, or price range."}
          </p>
          {savedOnly && !source.length ? (
            <a href="#/shop" className="button">
              Explore the collection <Icon name="arrow" size={17} />
            </a>
          ) : (
            <button className="button" onClick={reset}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}
