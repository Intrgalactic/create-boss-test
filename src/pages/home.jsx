import Pricing from 'src/layouts/pricing'
import Benefits from "src/layouts/benefits";
import Contact from "src/layouts/contact";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import Hero from "src/layouts/hero";
import ServiceOverview from "src/layouts/service-overview";
import Testimonials from "src/layouts/testimonials";

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <ServiceOverview />
            <Benefits />
            <Testimonials />
            <Pricing />
            <Contact />
            <Footer/>
        </>
    )
}