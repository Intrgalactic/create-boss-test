import { Suspense, lazy, useRef, useState } from "react"
import loadable from "@loadable/component";
import { getAuth } from "firebase/auth";
const AuthContainer = lazy(() => import("src/components/auth/auth-container.jsx").then(module => {return { default: module.AuthContainer }}));
const AuthForm = lazy(() => import("src/components/auth/auth-form").then(module => {return { default: module.AuthForm }}));
const CtaButton = lazy(() => import("src/components/cta-button").then(module => {return { default: module.CtaButton }}));
const Footer = loadable(() => import("src/layouts/footer"));
const Header = loadable(() => import("src/layouts/header"));
import Loader from "src/layouts/loader";

export default function ResetPassword() {
    const [firebaseErr, setFirebaseErr] = useState();
    const [validateErr, setValidateErr] = useState();
    const [loadingState,setLoadingState] = useState();
    const [successState,setSuccessState] = useState();
    const auth = getAuth();
    const userData = useRef({
        email: ""
    })
    async function sendPasswordResetEmailLink(e) {
         e.preventDefault();
        if ((await import('src/utils/utilities')).validateForm(userData.current, setValidateErr)) {
            setLoadingState(true);
            (await import('src/utils/utilities')).sendPasswordResetEmail(auth, userData.current.email).then(() => {
                setLoadingState(false);
                setFirebaseErr(false);
                setValidateErr(false);
                setSuccessState("We sent email with further instructions");
            }).catch(async err => {
                setLoadingState(false);
                (await import('src/utils/utilities')).getFirebaseErr(err.message,setFirebaseErr);
            })
        }
    }
    return (
        <Suspense fallback={<Loader />}>
            <div className="reset-password-page">
                <Header />
                <AuthContainer heading="Authenticate To Reset Password">
                    <AuthForm>
                        <input type="email" placeholder="Email" onChange={(e) => userData.current.email = e.target.value}/>
                        {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : successState && <font className="auth__form-success">{successState}</font>}
                        <CtaButton text="Authenticate" action={sendPasswordResetEmailLink} />
                    </AuthForm>
                </AuthContainer>
                <Footer/>
            </div>
            {loadingState ? <Loader/> : null}
        </Suspense>

    )
}