import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { NavButton } from "src/components/header/nav-button.jsx";
import { useContext } from "react";
import { authContext } from "src/context/authContext";
import { logOutUser } from "src/utils/utilities";
import { auth } from "../../firebase.js";
import { HeaderLinksList } from "src/components/header/header-links-list.jsx";
import useWindowSize from "src/hooks/useWindowSize.jsx";
const NavWithRef = forwardRef((props, ref) => {
  const isLogged = useContext(authContext);
  const path = useLocation().pathname;
  const [isPaying, setIsPaying] = useState(false);
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  function scrollToItem(e, item) {
    props.toggleNav();
    document.querySelector(item).scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    if (path === "/onboard" && auth.currentUser) {
      fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}get-user?email=${auth.currentUser.email}`).then(res => res.json()).then(data => {
        setIsPaying(data.isPaying)
      });
    }

  }, [setIsPaying, auth.currentUser, windowSize.width]);
  return (
    <nav ref={ref}>
      {props.isNavOpened ? <NavButton toggleNav={props.toggleNav} /> : null}
      {path !== "/onboard" || isPaying == "false" ? <Link to='/'>Home</Link> : null}
      {path.includes('dashboard') ?
        <>
          <Link to='/dashboard'>
            Dashboard
          </Link>
          {windowSize.width > 768 ?
            <>
              <HeaderLinksList heading="Talk & Text">
                <Link to='/dashboard/services/text-to-speech'>
                  Text To Speech
                </Link>
                <Link to='/dashboard/services/speech-to-text'>
                  Speech To Text
                </Link>
              </HeaderLinksList>
              <HeaderLinksList heading="Videos">
                <Link to='/dashboard/services/subtitles-to-video'>
                  Subtitles To Video
                </Link>
                <Link to='/dashboard/services/subtitles-from-video'>
                  Subtitles From Video
                </Link>
              </HeaderLinksList>
            </> : <>
              <Link to='/dashboard/services/text-to-speech'>
                Text To Speech
              </Link>
              <Link to='/dashboard/services/speech-to-text'>
                Speech To Text
              </Link>
              <Link to='/dashboard/services/subtitles-to-video'>
                Subtitles To Video
              </Link>
              <Link to='/dashboard/services/subtitles-from-video'>
                Subtitles From Video
              </Link>
            </>
          }
          <Link to='/account-settings'>
            Account Settings
          </Link>
          <Link onClick={logOutUser}>
            Logout
          </Link>
        </> :
        path !== "/onboard" ?
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
            {isPaying == "false" &&
              <>
                <Link to='/account-settings'>
                  Account Settings
                </Link>
                <Link onClick={logOutUser}>
                  Logout
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