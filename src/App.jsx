import './App.css'
import Header from './layouts/header'
import Hero from './layouts/hero'
import ServiceOverview from './layouts/service-overview'
import Benefits from './layouts/benefits'
import Testimonials from './layouts/testimonials'
import Pricing from './layouts/pricing'
import Contact from './layouts/contact'
import Footer from './layouts/footer'
import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <Header />
      <Hero />
      <ServiceOverview />
      <Benefits />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </>
  )
}

export default App
