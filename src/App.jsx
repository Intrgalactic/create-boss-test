import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import AboutUs from './pages/about-us'
function App() {

  return (
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path="/about-us" element={<AboutUs/>}/>
    </Routes>
  )
}

export default App
