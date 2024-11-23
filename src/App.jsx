import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Layout from './components/Layout'
import Home from './pages/home';

function App() {

  return (
    <Router>
      {/* <Layout> */}
        <Navbar/>
        <Home/>
      {/* </Layout> */}

    </Router>
  )
}

export default App
