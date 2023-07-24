import { AboutUsContainer } from "src/components/about-us-container";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";

export default function AboutUs() {
    return (
        <div className="about-us-page">
            <Header />
            <AboutUsContainer />
            <Footer/>
        </div>
    )
}