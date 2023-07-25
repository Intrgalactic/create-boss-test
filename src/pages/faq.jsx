import { FaqContainer } from "src/components/faq-container";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";

export default function Faq() {
    return (
        <div className="faq-page">
            <Header/>
            <FaqContainer/>
            <Footer/>
        </div>
    )
}