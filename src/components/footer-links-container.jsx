import { Link } from "react-router-dom";

export function FooterLinksContainer({links}) {
    return (
        <div className="footer-links-single-container">
            <h5>{links.heading}</h5>
            {links.href.map((link,index) => (
                <Link key={index} to ={`/${link}`}>{link}</Link>
            ))}
        </div>
    )
}