import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Home from './pages/home';

function App() {

  return (
    <Router>
      <Navbar/>
      <Home/>
    </Router>
  )
}

export default App
