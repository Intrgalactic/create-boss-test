import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Suspense, useRef, useState } from "react"
import { AuthContainer } from "src/components/auth/auth-container"
import { AuthForm } from "src/components/auth/auth-form"
import { CtaButton } from "src/components/cta-button";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import Loader from "src/layouts/loader";
import { getFirebaseErr, validateForm } from "src/utils/utilities";

export default function ResetPassword() {
    const [firebaseErr, setFirebaseErr] = useState();
    const [validateErr, setValidateErr] = useState();
    const [loadingState,setLoadingState] = useState();
    const [successState,setSuccessState] = useState();
    const auth = getAuth();
    const userData = useRef({
        email: ""
    })
    function sendPasswordResetEmailLink(e) {
         e.preventDefault();
        if (validateForm(userData.current, setValidateErr)) {
            setLoadingState(true);
            sendPasswordResetEmail(auth, userData.current.email).then(() => {
                setLoadingState(false);
                setFirebaseErr(false);
                setValidateErr(false);
                setSuccessState("We sent email with further instructions");
            }).catch(err => {
                setLoadingState(false);
                getFirebaseErr(err.message,setFirebaseErr);
            })
        }
    }
    return (
        <Suspense fallback={<Loader />}>
            <div className="reset-password-page">
                <Header />
                <AuthContainer heading="Authenticate To Reset Password">
                    <AuthForm>
                        <input type="email" placeholder="Email" onChange={(e) => { userData.current.email = e.target.value }} />
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