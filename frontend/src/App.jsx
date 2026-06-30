import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar.jsx'
import Home from './components/home.jsx'
import Cart from './components/cart.jsx'  
import Auth from './components/auth.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AdminRoute from './routes/AdminRoute.jsx'
import CompareFloatingButton from './components/CompareFloatingButton.jsx'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
      <CompareFloatingButton />
    </Router>
  );
}

export default App

