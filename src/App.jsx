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
import Checkout from './pages/CheckOut';

function App() {

  return (
    <Router>
        <div className="App">
          <Navbar/>
          <div className="Content">
            <Routes>
              <Route path='/' element={
                <div className="  min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0">
                  <HomeFirst/>
                  <HomeMenu/>
                  <Location/>
                  <HomeGallery/>
                  <Footer/> 
                </div>
              }/>
              
              <Route path='/menu' element={
                <Menu/>
              }/>
              
              <Route path='/menu/item' element={
                <Item/>
              }/>
              
              <Route path='/cart' element={
                <Keranjang/>
              }/>

              <Route path='/login' element={
                <Login/>
              }/>
              <Route path='/checkout' element={
                <Checkout/>
              }/>
            </Routes>
          </div>
        </div>
    </Router>
  )
}

export default App

// w-screen min-h-screen absolute top-0 left-0 right-0