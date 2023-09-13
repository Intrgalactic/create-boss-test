
import loadable from "@loadable/component";
import { lazy } from "react";
const FaqContainer = lazy(() => import("src/components/faq/faq-container").then(module => {
    return {default:module.FaqContainer}
}))
const Footer = loadable(() => import("src/layouts/footer"));
const Header = loadable(() => import("src/layouts/header"));

export default function Faq() {
    return (
        <div className="faq-page">
            <Header/>
            <FaqContainer/>
            <Footer/>
        </div>
    )
}