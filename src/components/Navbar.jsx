import Icon from "./Icon";
export default function Navbar({ count, savedCount, route }) {
  return (
    <>
      <div className="announcement">
        A considered collection. A working portfolio demo.{" "}
        <span>No real purchases or payments.</span>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#/shop" aria-label="Form and Field home">
          form <i>&</i> field<span>•</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href="#/shop"
            aria-current={route === "/shop" ? "page" : undefined}
          >
            Shop all
          </a>
          <a
            href="#/about"
            aria-current={route === "/about" ? "page" : undefined}
          >
            Our story
          </a>
        </nav>
        <div className="header-tools">
          <a
            href="#/saved"
            className="saved-link"
            aria-label={`Saved items (${savedCount})`}
          >
            <Icon name="heart" />
            <span className="desktop-label">Saved</span>
            {savedCount > 0 && <sup>{savedCount}</sup>}
          </a>
          <a
            href="#/cart"
            className="cart-link"
            aria-label={`Shopping bag (${count})`}
          >
            <Icon name="bag" />
            <span className="desktop-label">Bag</span>
            <b>{count}</b>
          </a>
        </div>
      </header>
    </>
  );
}
