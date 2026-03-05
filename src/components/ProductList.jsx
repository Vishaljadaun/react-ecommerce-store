// // =========================================
// // useEffect — running code AFTER render
// // useState  — storing the fetched data
// //
// // We need BOTH:
// // useState  → to store products once fetched
// // useEffect → to trigger the fetch at the right time
// // =========================================
// import { useState, useEffect } from 'react'

// // Import ProductCard — ProductList will use it
// // to render each individual product
// import ProductCard from './ProductCard'

// function ProductList() {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         setLoading(true)
//         const response = await fetch('https://fakestoreapi.com/products')
//         if (!response.ok) throw new Error('Failed to fetch products')
//         const data = await response.json()
//         setProducts(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchProducts()
//   }, [])

//   if (loading) return <p>Loading products...</p>
//   if (error) return <p>Error: {error}</p>

//   return (
//     <div className="product-list">
//       <h2>All Products ({products.length})</h2>

//       <div className="products-grid">
//         {products.map((product) => (
//           // =========================================
//           // Passing the entire product object as a prop
//           // Each ProductCard gets its own product
//           // key still goes on the outermost element in the loop
//           // =========================================
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ProductList

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

// =========================================
// ProductList receives onAddToCart from App
// and passes it further down to each ProductCard
// This is called "props drilling"
// =========================================
function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch('https://fakestoreapi.com/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <p>Loading products...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="product-list">
      <h2>All Products ({products.length})</h2>
      <div className="products-grid">
        {products.map((product) => (
          // Pass onAddToCart further down to each card
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList