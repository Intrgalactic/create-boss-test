import { Link } from "react-router-dom";
import { ContentContainer } from "./content-container";
import { FooterLinksContainer } from "./footer-links-container";

export function FooterContainer() {
    const links = [
        {
            heading: "Social",
            href: ["Instagram","Facebook","Twitter","Youtube"] 
        },
        {
            heading: "Company",
            href: ["About Us","Partnership","FAQ"]
        },
        {
            heading: "Pricing",
            href: ["Pricing Overview","Enterprises","Refund Policy"]
        },
        {
            heading: "Support",
            href: ["Reqeust Support","Contact Us"]
        }
    ]
    return (
        <div className="footer-container">
            <ContentContainer containerClass="footer-container__links">
                <FooterLinksContainer links={links[0]}/>
                <FooterLinksContainer links={links[1]}/>
                <FooterLinksContainer links={links[2]}/>
                <FooterLinksContainer links={links[3]}/>
            </ContentContainer>
            <ContentContainer containerClass="footer-container__end">
                <p>&copy; CreateBoss 2023</p>
                <Link to='/terms'>Terms</Link>
                <Link to='/privay'>Privacy</Link>
            </ContentContainer>
        </div>
    )
}