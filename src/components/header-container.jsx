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
            navRef.current.style.left = "-50vw";
        }
        else {
            navRef.current.classList.toggle("visible");
            setIsNavOpened(!isNavOpened);
            setTimeout(() => {
                navRef.current.style.left = "0";
            }, 150);
        }
        setIsNavOpened(!isNavOpened);
    }
    console.log(isNavOpened);
    return (
        <div className="header__container">
            <img src={logo} alt="createBoss logo" width="112px" height="48px" />
            <Nav ref={navRef} toggleNav={toggleNav} isNavOpened={isNavOpened} />
            <NavButton toggleNav={toggleNav} />
        </div>
    )
}