import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import CheckOut from './pages/CheckOut';
import Detail from './pages/detail';
import Admin from './pages/admin/Product';
import Transaction from './pages/admin/Transaction';
import History from './pages/admin/History';
import Orders from './pages/admin/Orders';
import AddProduct from './pages/admin/AddProduct';

function App() {

  return (
    <Router>
        <div className="App">
          <Routes>
            <Route path="/admin/product" element={<Admin />} />
            <Route path="/admin/transaction" element={<Transaction/>}/>
            <Route path="/admin/history" element={<History/>}/>
            <Route path="/admin/orders" element={<Orders/>}/>
            <Route path="/admin/product/add" element={<AddProduct/>}></Route>
            
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
                    <Route path='/menu/item' element={<Item/>} />
                    <Route path='/cart' element={<Keranjang/>} />
                    <Route path='/login' element={<Login/>} />
                    <Route path='/checkout' element={<CheckOut/>} />
                    <Route path='/detail' element={<Detail/>} />
                  </Routes>
                </div>
              </>
            } />
          </Routes>
        </div>
    </Router>
  )
}

export default App

// w-screen min-h-screen absolute top-0 left-0 right-0