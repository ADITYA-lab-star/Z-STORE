import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar.jsx'
import Home from './components/home.jsx'
import Cart from './components/cart.jsx'  

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        {/* Add more routes here for Products, About, Contact pages */}
      </Routes>
    </Router>
  );
}

export default App
