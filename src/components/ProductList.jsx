// =========================================
// useEffect — running code AFTER render
// useState  — storing the fetched data
//
// We need BOTH:
// useState  → to store products once fetched
// useEffect → to trigger the fetch at the right time
// =========================================
import { useState, useEffect } from 'react'

function ProductList() {

  // 3 pieces of state every API call needs:
  const [products, setProducts] = useState([])     // the data (starts as empty array)
  const [loading, setLoading] = useState(true)     // are we waiting? (starts true)
  const [error, setError] = useState(null)         // did something go wrong? (starts null)

  // =========================================
  // useEffect takes 2 arguments:
  // 1. A function — the code to run
  // 2. A dependency array — WHEN to run it
  //
  // [] empty array = run once after first render
  // [someValue]    = run when someValue changes
  // no array       = run after EVERY render (rarely what you want)
  // =========================================
  useEffect(() => {

    // async function INSIDE useEffect
    // (useEffect itself cannot be async)
    async function fetchProducts() {
      try {
        setLoading(true)  // show loading state

        const response = await fetch('https://fakestoreapi.com/products')

        // check if request actually succeeded
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()  // convert response to JavaScript array
        setProducts(data)                   // save products into state → triggers re-render

      } catch (err) {
        // something went wrong (no internet, API down, etc.)
        setError(err.message)
      } finally {
        // finally runs whether fetch succeeded OR failed
        setLoading(false)  // hide loading state either way
      }
    }

    fetchProducts()  // call the function

  }, [])  // ← empty array: fetch only once when component first appears


  // =========================================
  // CONDITIONAL RENDERING
  // Show different UI based on current state
  // =========================================

  // Still waiting for data
  if (loading) {
    return <p>Loading products...</p>
  }

  // Something went wrong
  if (error) {
    return <p>Error: {error}</p>
  }

  // Data is ready — show it
  return (
    <div>
      <h2>Products ({products.length})</h2>

      {/* .map() loops through the array and returns JSX for each item */}
      {/* key prop is REQUIRED — helps React track which item is which */}
      {products.map((product) => (
        <div key={product.id}>
          <img
            src={product.image}
            alt={product.title}
            width="100"
          />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductList