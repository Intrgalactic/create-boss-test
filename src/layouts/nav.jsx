import { forwardRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { NavButton } from "src/components/nav-button";
const NavWithRef = forwardRef((props, ref) => {
  const path = useLocation().pathname;
  function scrollToItem(e, item) {
    props.toggleNav();
    document.querySelector(item).scrollIntoView({ behavior: "smooth" });
  }
  return (
    <nav ref={ref}>
      {props.isNavOpened ? <NavButton toggleNav={props.toggleNav} /> : null}
      <Link to='/'>Home</Link>
      <Link>Try It Out</Link>
      <Link to='/about-us'>About Us</Link>
      <Link to='/faq'>FAQ</Link>
      {path === "/" ?
        <>
          <Link onClick={(e) => { scrollToItem(e, ".pricing__box") }}>Pricing</Link>
          <Link onClick={(e) => { scrollToItem(e, ".contact-section__form-container") }}>Contact</Link>
        </> : null
      }
      <Link to='/sign-up'>Sign Up</Link>
      <Link to='/sign-in'>Login</Link>
    </nav>
  )
})

var Nav;
export default Nav = NavWithRef;