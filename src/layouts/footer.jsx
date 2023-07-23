import { FooterContainer } from "src/components/footer-container";
import Callout from "./callout";

export default function Footer() {
    return (
        <footer>
            <Callout heading="Ready to Begin?" description="Start your speech conversion journey today and unlock a world of possibilities with our comprehensive services" btnText="Let's get started!"/>
            <FooterContainer/>
        </footer>
    )
}