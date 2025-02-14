import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar'
import Menu from './pages/Menu';
import Location from './components/Location';
import HomeFirst from './components/HomeFirst';
import HomeMenu from './components/HomeMenu';
import Item from './pages/Item';
import Keranjang from './pages/Keranjang';
import Login from './pages/Login';
import Footer from './components/Footer';
import HomeGallery from './components/HomeGallery';
import Detail from './pages/detail';
import Admin from './pages/admin/Product';
import Transaction from './pages/admin/Transaction';
import History from './pages/admin/History';
import Orders from './pages/admin/Orders';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import OrderConfirmation from './pages/admin/OrderConfirmation';
import WaitingConfirmation from './pages/WaitingConfirmation';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CompletePayment from './pages/CompletePayment';
import PropTypes from 'prop-types';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/product" element={<Admin />} />
                    <Route path="/transaction" element={<Transaction/>} />
                    <Route path="/history" element={<History/>} />
                    <Route path="/orders" element={<Orders/>} />
                    <Route path="/order-confirmation" element={<OrderConfirmation/>} />
                    <Route path="/product/add" element={<AddProduct/>} />
                    <Route path="/product/edit/:id" element={<EditProduct/>} />
                  </Routes>
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <div className="Content">
                    <Routes>
                      <Route path='/' element={
                        <div className="min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0">
                          <HomeFirst/>
                          <HomeMenu/>
                          <Location/>
                          <HomeGallery/>
                          <Footer/> 
                        </div>
                      }/>
                      <Route path='/menu' element={<Menu/>} />
                      <Route path='/menu/item/:id' element={<Item/>} />
                      <Route path='/cart' element={<Keranjang/>} />
                      <Route path='/login' element={<Login/>} />
                      <Route path='/detail' element={<Detail/>} />
                      <Route path='/complete-payment' element={<CompletePayment />} />
                      <Route path='/waiting-confirmation' element={<WaitingConfirmation />} />
                    </Routes>
                  </div>
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;

// w-screen min-h-screen absolute top-0 left-0 right-0