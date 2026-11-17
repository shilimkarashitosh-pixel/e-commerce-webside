import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import React from "react";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("freshfruit-cart") || "[]"); }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("freshfruit-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get("/products", { params: { search, category } })
      .then((response) => { if (active) { setProducts(response.data); setError(""); } })
      .catch(() => { if (active) setError("Could not connect to the backend. Start MongoDB and the backend, then try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(product) {
    if (product.stock < 1) {
      setNotice("Sorry, this fruit is out of stock.");
      return;
    }
    setCart((current) => {
      const found = current.find((item) => item._id === product._id);
      if (found) {
        return current.map((item) => item._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to cart`);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function changeQuantity(id, delta) {
    setCart((current) => current
      .map((item) => item._id === id
        ? { ...item, quantity: Math.min(item.stock, item.quantity + delta) }
        : item)
      .filter((item) => item.quantity > 0));
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item._id !== id));
  }

  return (
    <div className="app-shell">
      <div className="top-strip">Fresh from the farm · Delivered with care</div>
      <header className="navbar">
        <a href="#home" className="brand" aria-label="FreshFruit home">
          <span className="brand-icon">✿</span><span>fresh<span className="brand-green">fruit</span></span>
        </a>
        <nav className="nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#why-us">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open shopping cart">
          <span>🛒</span> Cart <b>{cartCount}</b>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span></span> GOOD FOOD, GOOD MOOD</div>
            <h1>Nature's best.<br /><em>Picked for you.</em></h1>
            <p>Bring home the goodness of fresh, colourful fruits. Handpicked for quality and delivered to your doorstep.</p>
            <a className="primary-button" href="#products">Shop fresh fruits <span>↗</span></a>
            <div className="hero-points">
              <div><strong>100%</strong><small>Fresh picks</small></div>
              <div><strong>Farm</strong><small>To your door</small></div>
              <div><strong>Daily</strong><small>Fresh stock</small></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-circle"></div>
            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=85" alt="A basket of colourful fresh fruit" />
            <div className="floating-note"><span>🍊</span><div><b>Freshness first</b><small>Every single day</small></div></div>
            <div className="leaf leaf-one">❧</div><div className="leaf leaf-two">❧</div>
          </div>
        </section>

        <section className="benefits" id="why-us">
          <div className="benefit"><span className="benefit-icon">🌿</span><div><b>Fresh & natural</b><small>Carefully selected produce</small></div></div>
          <div className="benefit"><span className="benefit-icon">🚚</span><div><b>Quick delivery</b><small>Freshness at your doorstep</small></div></div>
          <div className="benefit"><span className="benefit-icon">♡</span><div><b>Quality you trust</b><small>Goodness in every bite</small></div></div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div><div className="eyebrow">OUR FARM-FRESH SELECTION</div><h2>Fresh picks <em>for you</em></h2></div>
            <p>Colourful, delicious and full of goodness.</p>
          </div>
          <div className="shop-controls">
            <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your favourite fruit..." /></label>
            <div className="category-list" aria-label="Filter by category">
              {["All", ...new Set(products.map((product) => product.category))].map((item) => (
                <button key={item} className={category === item ? "category active-category" : "category"} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>

          {loading && <div className="state-message">Loading fresh fruits...</div>}
          {error && <div className="state-message error-message">{error}<br /><button className="outline-button" onClick={() => setSearch((value) => value)}>Retry</button></div>}
          {!loading && !error && products.length === 0 && <div className="state-message">No fruits found. Try another search.</div>}

          <div className="product-grid">
            {products.map((product, index) => (
              <article className="product-card" key={product._id}>
                <div className="product-image-wrap">
                  <span className="product-tag">{index % 2 === 0 ? "FRESH PICK" : "FARM FRESH"}</span>
                  <img src={product.image || "https://placehold.co/500x400?text=Fresh+Fruit"} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://placehold.co/500x400/f5f6ee/496b39?text=Fresh+Fruit"; }} />
                  <button className="quick-add" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>＋</button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-bottom"><div><strong>{money(product.price)}</strong><span> / kg</span></div><button className="add-button" onClick={() => addToCart(product)} disabled={product.stock < 1}>{product.stock < 1 ? "Sold out" : "Add to cart"}</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="promo">
          <div><div className="eyebrow">A LITTLE DAILY GOODNESS</div><h2>Eat colourful.<br /><em>Feel wonderful.</em></h2><p>Make fresh fruit a part of your everyday routine.</p><a className="light-button" href="#products">Explore the collection ↗</a></div>
          <div className="promo-fruit" aria-hidden="true">🍊 🍎 🍐 🍇</div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="footer-main">
          <div><a href="#home" className="brand footer-brand"><span className="brand-icon">✿</span><span>fresh<span className="brand-green">fruit</span></span></a><p>Bringing nature's goodness to your home, one fresh pick at a time.</p></div>
          <div><h4>Explore</h4><a href="#home">Home</a><a href="#products">Shop fruits</a><a href="#why-us">About us</a></div>
          <div><h4>Get in touch</h4><a href="mailto:hello@freshfruit.example">hello@freshfruit.example</a><span>Mon–Sat · 8 AM–8 PM</span></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} FreshFruit. Learning project.</span><span>Made with care and a little fruit 🍓</span></div>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}
      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping cart">
          <div className="drawer-header"><div><small>YOUR BASKET</small><h2>Shopping cart ({cartCount})</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
          {cart.length === 0 ? <div className="empty-cart"><span>🧺</span><h3>Your basket is empty</h3><p>Add some fresh favourites to get started.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Explore fruits</button></div> :
            <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item._id}><img src={item.image || "https://placehold.co/120x120?text=Fruit"} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://placehold.co/120x120/f5f6ee/496b39?text=Fruit"; }} /><div className="cart-item-info"><b>{item.name}</b><strong>{money(item.price * item.quantity)}</strong><div className="quantity-control"><button onClick={() => changeQuantity(item._id, -1)} aria-label={`Decrease ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item._id, 1)} disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name}`}>+</button><button className="remove-item" onClick={() => removeFromCart(item._id)}>Remove</button></div></div></div>)}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><p>Delivery charges calculated at checkout.</p><button className="checkout-button" onClick={() => alert("Checkout is a demo feature. Online payments and order processing are not configured yet.")}>Continue to checkout →</button></div></>}
        </aside>
      </div>}
    </div>
  );
}

export default App;
