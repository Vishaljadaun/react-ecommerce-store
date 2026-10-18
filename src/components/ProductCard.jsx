import Icon from "./Icon";
import { money } from "../lib/shop";
export default function ProductCard({
  product: p,
  onAdd,
  saved,
  onSave,
  quantity = 0,
}) {
  return (
    <article className="product-card">
      <div className="product-visual" style={{ background: p.background }}>
        {p.tag && <span className="product-tag">{p.tag}</span>}
        <a href={`#/product/${p.id}`} aria-label={`View ${p.name}`}>
          <img
            src={`/art/${p.art}.svg`}
            alt={p.name}
            loading="lazy"
            width="480"
            height="480"
          />
        </a>
        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          onClick={() => onSave(p.id)}
          aria-label={`${saved ? "Unsave" : "Save"} ${p.name}`}
          aria-pressed={saved}
        >
          <Icon name="heart" />
        </button>
        <button
          className="quick-add"
          disabled={quantity >= p.limit}
          onClick={() => onAdd(p.id)}
          aria-label={`Add ${p.name} to bag`}
        >
          <Icon name="plus" size={16} />
          {quantity >= p.limit ? "Bag limit reached" : "Add to bag"}
        </button>
      </div>
      <div className="product-info">
        <div>
          <p>
            {p.category} <span> / {p.color}</span>
          </p>
          <h3>
            <a href={`#/product/${p.id}`}>{p.name}</a>
          </h3>
        </div>
        <strong>{money(p.price)}</strong>
      </div>
    </article>
  );
}
