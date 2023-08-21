import Nav from "src/layouts/nav";
import { NavButton } from "./nav-button";
import logo from 'src/assets/images/logo.png';
import { useRef, useState } from "react";

export function HeaderContainer() {
    const navRef = useRef();
    const [isNavOpened, setIsNavOpened] = useState(false);
    function toggleNav() {
        if (isNavOpened) {
            navRef.current.classList.toggle("visible");
            navRef.current.style.left = "-100vw";
        }
        else {
            navRef.current.classList.toggle("visible");
            setIsNavOpened(!isNavOpened);
            setTimeout(() => {
                navRef.current.style.left = "0";
            }, 0);
        }
        setIsNavOpened(!isNavOpened);
    }
    return (
        <div className="header__container">
            <img src={logo} alt="createBoss logo" width="240px" height="42px" />
            <Nav ref={navRef} toggleNav={toggleNav} isNavOpened={isNavOpened} />
            <NavButton toggleNav={toggleNav} />
        </div>
    )
}