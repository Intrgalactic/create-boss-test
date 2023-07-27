import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { NavButton } from "src/components/nav-button";
import { useContext } from "react";
import { authContext } from "src/context/authContext";
import { logOutUser } from "src/utils/utilities";
import { auth } from "../../firebase.js";
const NavWithRef = forwardRef((props, ref) => {
  const isLogged = useContext(authContext);
  const path = useLocation().pathname;
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();
  function scrollToItem(e, item) {
    props.toggleNav();
    document.querySelector(item).scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    if (path === "/onboard" && auth.currentUser) {
      fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}get-user?email=${auth.currentUser.email}`).then(res => res.json()).then(data => {
        setIsPaying(data.isPaying)});
    }
 
  }, [setIsPaying,auth.currentUser]);
  return (
    <nav ref={ref}>
      {props.isNavOpened ? <NavButton toggleNav={props.toggleNav} /> : null}
      {path !=="/onboard" || isPaying == "false" ? <Link to='/'>Home</Link> : null}
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
          {isLogged ? <Link to='/dashboard'>Dashboard</Link> : <Link to='/sign-in'>Login</Link>}
          {!isLogged ? <Link to='/sign-up'>Sign Up</Link> : <Link onClick={logOutUser}>Logout</Link>}

        </> : <>
          {isPaying == "false" ?
            <>
              <Link to='/account-settings'>
                Account Settings
              </Link>
              <Link onClick={logOutUser}>
                Logout
              </Link>
            </> : 
            <>
              <Link to='/dashboard'>
                Dashboard
              </Link>
              <Link to='/dashboard/services/text-to-speech'>
                Text To Speech
              </Link>
              <Link to='/dashboard/services/speech-to-text'>
                Speech To Text
              </Link>
              <Link to='/dashboard/services/video-section'>
                Video Section
              </Link>
            </>
          }
        </>
      }

    </nav>
  )
})

var Nav;
export default Nav = NavWithRef;