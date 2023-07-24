import Nav from "src/layouts/nav";
import { NavButton } from "./nav-button";
import logo from 'src/assets/images/logo.png';

export function HeaderContainer() {
    return (
        <div className="header__container">
            <img src={logo} alt="createBoss logo" width="112px" height="48px"/>
            <Nav />
            <NavButton />
        </div>
    )
}