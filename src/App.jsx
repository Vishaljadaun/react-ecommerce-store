// =========================================
// HOW TO USE A COMPONENT
// Step 1 — import it (tell React where to find it)
// Step 2 — use it like an HTML tag <Navbar />
// =========================================

// Importing our Navbar component
// The path './components/Navbar' tells React exactly where the file is
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      {/* Using Navbar like an HTML tag — this is the magic of components */}
      {/* React will replace <Navbar /> with whatever Navbar() function returns */}
      {/* <Navbar /> */}

            {/* Passing data into Navbar using props */}
      {/* storeName and tagline are the prop names we defined */}
      <Navbar storeName="ShopReact" tagline="Best deals online" />

      <h1>React E-Commerce Store</h1>
    </div>
  )
}

export default App