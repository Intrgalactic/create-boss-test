import { Suspense, lazy, useRef, useState } from "react";
import {     useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
const Link = lazy(() => import('react-router-dom').then(module => {
    return {default: module.Link}
}))

const AuthContainer = lazy(() => import("src/components/auth/auth-container.jsx").then(module => { return { default: module.AuthContainer } }));
const AuthForm = lazy(() => import("src/components/auth/auth-form").then(module => { return { default: module.AuthForm } }));
const CtaButton = lazy(() => import("src/components/cta-button").then(module => { return { default: module.CtaButton } }));
const Footer = loadable(() => import("src/layouts/footer"));
const Header = loadable(() => import("src/layouts/header"));
const Loader = loadable(() => import("src/layouts/loader"));
import { auth } from "../../firebase.js";
export default function SignIn() {
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseError] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const userData = useRef({
        email: "",
        password: "",
    })
    const navigate = useNavigate();
    async function validateLoginForm(e) {
        e.preventDefault();
        const userCredentials = (await import("firebase/auth")).EmailAuthProvider.credential(userData.current.email, userData.current.password);
        if ((await import("src/utils/utilities")).validateForm(userData.current, setValidateErr)) {
            setLoadingState(true);
            (await import("firebase/auth")).signInWithCredential(auth, userCredentials).then(async () => {
                const userData = await ((await import("src/utils/utilities")).fetchUrl(`${import.meta.env.VITE_SERVER_FETCH_URL}get-user?email=${auth.currentUser.email}`));
                await navigate('/dashboard');
                setLoadingState(false);
            })
                .catch(async err => {
                    (await import("src/utils/utilities")).validateCallback([(await import("src/utils/utilities.js")).getFirebaseErr], err.message, setFirebaseError);
                    setLoadingState(false);
                })
        }
    }
    return (
        <div className="sign-in-page">
            <Suspense fallback={<Loader />}>
                <Header />
                <AuthContainer heading="Login To CreateBoss Dashboard">
                    <AuthForm>
                        <input type="email" placeholder="Your E-Mail" onChange={(e) => { userData.current.email = e.target.value }} />
                        <input type="password" placeholder="Your Password" onChange={(e) => { userData.current.password = e.target.value }} />
                        {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : null}
                        <Link to="/reset-password">Reset Your Password</Link>
                        <Link to='/sign-up'>Don’t have account yet? Join to CreateBoss today!</Link>
                        <CtaButton text="Login" action={validateLoginForm} />
                    </AuthForm>
                    {loadingState ? <Loader /> : null}
                </AuthContainer>
                <Footer />
            </Suspense>
        </div>
    )
}