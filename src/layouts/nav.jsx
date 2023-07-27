import { forwardRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { NavButton } from "src/components/nav-button";
import { useContext } from "react";
import { authContext } from "src/context/authContext";
import { logOutUser } from "src/utils/utilities";

const NavWithRef = forwardRef((props, ref) => {
  const isLogged = useContext(authContext);
  const path = useLocation().pathname;
  const navigate = useNavigate();
  function scrollToItem(e, item) {
    props.toggleNav();
    document.querySelector(item).scrollIntoView({ behavior: "smooth" });
  }
  return (
    <nav ref={ref}>
      {props.isNavOpened ? <NavButton toggleNav={props.toggleNav} /> : null}
      <Link to='/'>Home</Link>
      {path !== "/onboard" ?
        <>
          <Link>Try It Out</Link>
          <Link to='/about-us'>About Us</Link>
          <Link to='/faq'>FAQ</Link>
          {path === "/" ?
            <>
              <Link onClick={(e) => { scrollToItem(e, ".pricing__box") }}>Pricing</Link>
              <Link onClick={(e) => { scrollToItem(e, ".contact-section__form-container") }}>Contact</Link>
            </> : null

          }
          {!isLogged ? <Link to='/sign-up'>Sign Up</Link> : <Link onClick={logOutUser}>Logout</Link>}
          <Link to='/sign-in'>Login</Link>
        </> : <>
          <Link to='/account-settings'>
            Account Settings
          </Link>
          <Link to='/account-settings'>
            Logout
          </Link>
        </>
      }

    </nav>
  )
})

var Nav;
export default Nav = NavWithRef;