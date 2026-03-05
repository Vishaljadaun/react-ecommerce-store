// // =========================================
// // HOW TO USE A COMPONENT
// // Step 1 — import it (tell React where to find it)
// // Step 2 — use it like an HTML tag <Navbar />
// // =========================================

// // Importing our Navbar component
// // The path './components/Navbar' tells React exactly where the file is
// import Navbar from './components/Navbar'
// import ProductList from './components/ProductList'

// function App() {
//   return (
//     <div>
//       {/* Using Navbar like an HTML tag — this is the magic of components */}
//       {/* React will replace <Navbar /> with whatever Navbar() function returns */}
//       {/* <Navbar /> */}

//             {/* Passing data into Navbar using props */}
//       {/* storeName and tagline are the prop names we defined */}
//       <Navbar storeName="ShopReact" tagline="Best deals online" />

//       <h1>React E-Commerce Store</h1>
//       {/* ProductList fetches and displays all products */}
//       <ProductList />
//     </div>
//   )
// }

// export default App

// =========================================
// LIFTING STATE UP
// cartCount moves here because App is the
// common parent of both Navbar and ProductCard
// =========================================
import { useState } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'

function App() {

  // Cart state lives here now — not inside Navbar
  const [cartCount, setCartCount] = useState(0)

  // This function will be passed DOWN to ProductCard
  // When called, it adds 1 to the cart
  function handleAddToCart() {
    setCartCount(cartCount + 1)
  }

  return (
    <div>
      {/* Pass cartCount DOWN to Navbar so it can display it */}
      <Navbar
        storeName="ShopReact"
        tagline="Best deals online"
        cartCount={cartCount}
      />

      {/* Pass handleAddToCart DOWN to ProductList */}
      {/* ProductList will pass it further down to ProductCard */}
      <ProductList onAddToCart={handleAddToCart} />
    </div>
  )
}

export default App