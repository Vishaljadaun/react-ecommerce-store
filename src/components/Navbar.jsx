// =========================================
// WHAT IS THIS FILE?
// A Component is just a JavaScript function
// that returns HTML-like code called JSX.
// The function name MUST start with a capital letter.
// =========================================

// =========================================
// PROPS — passing data into a component
//
// Props come in as a parameter called 'props'
// It's just a plain JavaScript object
// containing everything the parent passed in
// =========================================

// function Navbar() {
//   return (
//     // JSX looks like HTML but it's actually JavaScript
//     // That's why we use className instead of class
//     <nav className="navbar">
//       <h2>🛍️ ShopReact</h2>
//       <p>Your React Store</p>
//     </nav>
//   )
// }

// function Navbar(props) {
//   // props is an object that looks like:
//   // { storeName: "ShopReact", tagline: "Your React Store" }

//   return (
//     <nav className="navbar">
//       {/* We use curly braces {} to inject JavaScript inside JSX */}
//       {/* props.storeName accesses the storeName value we passed in */}
//       <h2>🛍️ {props.storeName}</h2>
//       <p>{props.tagline}</p>
//     </nav>
//   )
// }




// =========================================
// DESTRUCTURING PROPS — the cleaner way
// Instead of props.storeName, we pull out
// the values directly in the function parameter
// =========================================

function Navbar({ storeName, tagline }) {
  // Now we can use storeName and tagline directly
  // no need to write props.storeName every time
  return (
    <nav className="navbar">
      <h2>🛍️ {storeName}</h2>
      <p>{tagline}</p>
    </nav>
  )
}


// We MUST export the component so other files can use it
// Without this line, no other file can import this component
export default Navbar