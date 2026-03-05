// // =========================================
// // ProductCard — receives ONE product via props
// // and knows how to display it
// //
// // This component has ONE job:
// // "Given a product object, show it nicely"
// // =========================================

// function ProductCard({ product }) {
//   // product is an object that looks like:
//   // {
//   //   id: 1,
//   //   title: "Fjallraven Backpack",
//   //   price: 109.95,
//   //   image: "https://...",
//   //   category: "men's clothing",
//   //   description: "..."
//   // }

//   return (
//     <div className="product-card">
//       {/* Product image */}
//       <img
//         src={product.image}
//         alt={product.title}
//       />

//       {/* We use substring to keep long titles short */}
//       <h3>{product.title.substring(0, 40)}...</h3>

//       {/* Category badge */}
//       <p className="category">{product.category}</p>

//       {/* Price */}
//       <p className="price">${product.price}</p>

//       {/* Add to Cart button — we'll wire this up next */}
//       <button>Add to Cart</button>
//     </div>
//   )
// }

// export default ProductCard

// =========================================
// ProductCard receives onAddToCart from ProductList
// When button is clicked it calls that function
// which actually lives up in App.jsx
// =========================================
function ProductCard({ product, onAddToCart }) {

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title.substring(0, 40)}...</h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price}</p>

      {/* onClick calls onAddToCart which updates state in App */}
      {/* React then re-renders Navbar with the new cartCount */}
      <button onClick={onAddToCart}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard