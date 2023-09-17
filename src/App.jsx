import './App.css'
import { Routes, Route } from 'react-router-dom'
import loadable from '@loadable/component';
import { authContext } from './context/authContext'
import { useEffect, useState } from 'react'
import { auth } from '../firebase.js';

const OnBoard = loadable(() => import('./pages/onboard'));
const Dashboard = loadable(() => import('./pages/dashboard'));
const TTSDashboard = loadable(() => import('./pages/text-to-speech-dashboard'));
const STTDashboard = loadable(() => import('./pages/speech-to-text-dashboard'));
const STVDashboard = loadable(() => import('./pages/subtitles-to-video-dashboard'));
const Verify = loadable(() => import('./pages/user-action'));
const UserAction = loadable(() => import('./pages/user-action'));
const ResetPassword = loadable(() => import('./pages/reset-password'));
const SFVDashboard = loadable(() => import('./pages/subtitles-from-video-dashboard'));
const Home = loadable(() => import('./pages/home'));
const AboutUs = loadable(() => import('./pages/about-us'));
const Faq = loadable(() => import('./pages/faq'));
const SignIn = loadable(() => import('./pages/sign-in'));
const SignUp = loadable(() => import('./pages/sign-up'));
import { useCookies } from 'react-cookie';
import VCDashboard from './pages/voice-cloning-dashboard';

function App() {
  const [isLogged, setIsLogged] = useState();
  const data = new Date();
  const ms = data.getTime();
  const newData = new Date(ms + 604800000);
  useEffect(() => {
    (async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLogged(true);
        }
        else {
          setIsLogged(false);
        }
      })
    })();

  }, [setIsLogged, auth]);
  return (
    <Routes>
      <Route index exact path="/" element={<authContext.Provider value={isLogged}><Home /></authContext.Provider>} />
      <Route exact path="/about-us" element={<authContext.Provider value={isLogged}><AboutUs /></authContext.Provider>} />
      <Route exact path="/sign-in" element={<authContext.Provider value={isLogged}><SignIn /></authContext.Provider>} />
      <Route exact path="/sign-up" element={<authContext.Provider value={isLogged}><SignUp /></authContext.Provider>} />
      <Route exact path="/user-action" element={<authContext.Provider value={isLogged}><UserAction /></authContext.Provider>} />
      <Route exact path="/reset-password" element={<authContext.Provider value={isLogged}><ResetPassword /></authContext.Provider>} />
      <Route exact path="/verify" element={<authContext.Provider value={isLogged}><Verify /></authContext.Provider>} />
      <Route exact path="/faq" element={<authContext.Provider value={isLogged}><Faq /></authContext.Provider>} />
      <Route exact path="/onboard" element={<authContext.Provider value={isLogged}><OnBoard /></authContext.Provider>} />
      <Route exact path="/dashboard" element={<authContext.Provider value={isLogged}><Dashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/text-to-speech" element={<authContext.Provider value={isLogged}><TTSDashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/voice-cloning" element={<authContext.Provider value={isLogged}><VCDashboard/></authContext.Provider>} />
      <Route exact path="/dashboard/services/speech-to-text" element={<authContext.Provider value={isLogged}><STTDashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/subtitles-to-video" element={<authContext.Provider value={isLogged}><STVDashboard /></authContext.Provider>} />
      <Route exact path="/dashboard/services/subtitles-from-video" element={<authContext.Provider value={isLogged}><SFVDashboard /></authContext.Provider>} />
    </Routes>
  )
}

export default App
