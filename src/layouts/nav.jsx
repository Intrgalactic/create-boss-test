import { forwardRef } from "react";
import { Link } from "react-router-dom"
import { NavButton } from "src/components/nav-button";

const NavWithRef = forwardRef((props, ref) => {
  function scrollToItem(e,item) {
    props.toggleNav();
    document.querySelector(item).scrollIntoView({ behavior: "smooth" });
  }
  return (
    <nav ref={ref}>
       {props.isNavOpened ? <NavButton toggleNav={props.toggleNav}/> : null}
      <Link>Home</Link>
      <Link>Try It Out</Link>
      <Link onClick={(e) => { scrollToItem(e,".pricing__box") }}>Pricing</Link>
      <Link onClick={(e) => { scrollToItem(e,".contact-section__form-container") }}>Contact</Link>

    </nav>
  )
})

var Nav;
export default Nav = NavWithRef;