import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import AboutUs from './pages/about-us'
import Faq from './pages/faq'
import { authContext } from './context/authContext'
import SignIn from './pages/sign-in'
import SignUp from './pages/sign-up'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase.js';
import OnBoard from './pages/onboard'
import Dashboard from './pages/dashboard'
import TTSDashboard from './pages/text-to-speech-dashboard'
import STTDashboard from './pages/speech-to-text-dashboard'
import STVDashboard from './pages/subtitles-to-video-dashboard'
import Verify from './pages/user-action'
import UserAction from './pages/user-action'
import ResetPassword from './pages/reset-password'
import SFVDashboard from './pages/subtitles-from-video-dashboard'
function App() {
  const [isLogged, setIsLogged] = useState();
  const data = new Date();
  const ms = data.getTime();
  const newData = new Date(ms + 604800000);
  console.log(newData.toLocaleDateString("pl-PL"));
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
      }
      else {
        setIsLogged(false);
      }
    })
  }, [setIsLogged, auth]);

  function logOutUser() {
    signOut(auth);
  }

  return (
    <Routes>
      <Route exact path="/" element={<authContext.Provider value={isLogged}><Home /></authContext.Provider>} />
      <Route exact path="/about-us" element={<authContext.Provider value={isLogged}><AboutUs /></authContext.Provider>} />
      <Route exact path="/sign-in" element={<authContext.Provider value={isLogged}><SignIn /></authContext.Provider>} />
      <Route exact path="/sign-up" element={<authContext.Provider value={isLogged}><SignUp /></authContext.Provider>} />
      <Route exact path="/user-action" element={<authContext.Provider value={isLogged}><UserAction/></authContext.Provider>} />
      <Route exact path="/reset-password" element={<authContext.Provider value={isLogged}><ResetPassword/></authContext.Provider>} />
      <Route exact path="/verify" element={<authContext.Provider value={isLogged}><Verify/></authContext.Provider>} />
      <Route exact path="/faq" element={<authContext.Provider value={isLogged}><Faq /></authContext.Provider>} />
      <Route exact path="/onboard" element={<authContext.Provider value={isLogged}><OnBoard /></authContext.Provider>} />
      <Route exact path="/dashboard" element={<authContext.Provider value={isLogged}><Dashboard/></authContext.Provider>}/>
      <Route exact path="/dashboard/services/text-to-speech" element={<authContext.Provider value={isLogged}><TTSDashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/speech-to-text" element={<authContext.Provider value={isLogged}><STTDashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/subtitles-to-video" element={<authContext.Provider value={isLogged}><STVDashboard/></authContext.Provider>} />
      <Route exact path="/dashboard/services/subtitles-from-video" element={<authContext.Provider value={isLogged}><SFVDashboard/></authContext.Provider>} />
    </Routes>
  )
}

export default App
