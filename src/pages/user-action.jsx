import {  applyActionCode, confirmPasswordReset, signInWithCredential, verifyPasswordResetCode } from "firebase/auth";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const AuthContainer = lazy(() => import("src/components/auth/auth-container.jsx").then(module => {return { default: module.AuthContainer }}));
const AuthForm = lazy(() => import("src/components/auth/auth-form").then(module => {return { default: module.AuthForm }}));
const CtaButton = lazy(() => import("src/components/cta-button").then(module => {return { default: module.CtaButton }}));
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import { getFirebaseErr, isEqual, validatePassword } from "src/utils/utilities";
import { auth } from "../../firebase.js";
import Loader from "src/layouts/loader.jsx";
import { SectionHeading } from "src/components/section-heading.jsx";

export default function UserAction() {
    const navigate = useNavigate();
    const location = useLocation();
    const search = useMemo(() => { return new URLSearchParams(location.search) }, [location]);
    const actionCode = search.get('oobCode');
    const mode = search.get('mode');
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseErr] = useState();
    const [successState, setSuccessState] = useState();
    const [isEmailVerified, setIsEmailVerified] = useState();
    const [loadingState, setLoadingState] = useState(true);

    const userData = useRef({
        password: "",
        newPassword: "",
    })


    useEffect(() => {
        switch (search.get("mode")) {
            case "resetPassword": verifyPasswordResetCode(auth, actionCode).then(() => {
                setLoadingState(false);
            }).catch(err => {
                checkIsCodeGood(err.message);
            })
                break;
            case "verifyEmail": verifyUserEmail();
                break;

        }
    }, [actionCode, checkIsCodeGood, navigate, search]);

    function resetUserPassword(e) {
        e.preventDefault();
        if (validatePassword(userData.current.newPassword, setValidateErr) && validatePassword(userData.current.password, setValidateErr)) {
            if (!isEqual(userData.current.password, userData.current.newPassword)) {
                setValidateErr("The passwords don't match");
            }
            else {
                confirmPasswordReset(auth, actionCode, userData.current.newPassword).then(() => {
                    setSuccessState("Password updated");
                }).catch(err => {
                    console.log(err)
                    getFirebaseErr(err.message, setFirebaseErr);
                })
            }
        }
    }

    function verifyUserEmail() {
        applyActionCode(auth, actionCode).then(() => {
            setIsEmailVerified(true);
            setLoadingState(false);
        }).catch(err => {
            console.log(err)
            checkIsCodeGood(err.message);
        })
    }

    function checkIsCodeGood(err) {
        if (err === "Firebase: Error (auth/invalid-action-code)." || (err === "Firebase: Error (auth/internal-error)." && !isEmailVerified)) {
            setFirebaseErr("Something went wrong.");
        }
        else {
            getFirebaseErr(err, setFirebaseErr);
        }
    }
    function redirect() {
        auth.currentUser ? navigate('/dashboard') : navigate("/sign-in")
    }
    return (
        <Suspense fallback={<Loader />}>
            <div className="verify-page">
                {loadingState && mode !== "resetPassword" ? <Loader /> : null}
                <Header />
                {mode === "resetPassword" ?
                    <>
                        <AuthContainer heading="Reset Your Account Password">
                            <AuthForm>
                                <input type="password" placeholder="Old Password" onChange={(e) => { userData.current.password = e.target.value }} />
                                <input type="password" placeholder="New Password" onChange={(e) => { userData.current.newPassword = e.target.value }} />
                                {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : successState && <font className="auth__form-success">{successState}</font>}
                                {!successState ? <CtaButton text="Verify" action={resetUserPassword} /> : <CtaButton text={auth.currentUser ? "Dashboard" : "Login"} action={redirect} />}
                            </AuthForm>
                            {loadingState ? <Loader /> : null}
                        </AuthContainer>
                    </> :
                    mode === "verifyEmail" &&
                    <>
                        {isEmailVerified &&
                            <div className="email-verify__container">
                                <div className="email-verify__container-content">
                                    <SectionHeading heading="Your e-mail has been verified" />
                                    <CtaButton text={auth.currentUser ? "Dashboard" : "Login"} action={redirect} />
                                </div>
                            </div>
                        }
                    </>
                }
                <Footer />
            </div>
        </Suspense>
    )
}