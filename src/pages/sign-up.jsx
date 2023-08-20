import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from "firebase/auth";
import { Suspense, lazy, useContext, useRef, useState } from "react";
const AuthContainer = lazy(() => import("src/components/auth/auth-container.jsx").then(module => {return { default: module.AuthContainer }}));
const AuthForm = lazy(() => import("src/components/auth/auth-form").then(module => {return { default: module.AuthForm }}));
import Header from "src/layouts/header";
import { getFirebaseErr, validateCallback, validateForm } from "src/utils/utilities";
import { auth } from "../../firebase.js";
import Loader from "src/layouts/loader.jsx";
import { TermsCheckbox } from "src/components/terms-label.jsx";
import { useNavigate } from "react-router-dom";
const CtaButton = lazy(() => import('src/components/cta-button').then(module => {
    return { default: module.CtaButton }
}))
import { authContext } from "src/context/authContext.jsx";
const Footer = lazy(() => import('src/layouts/footer'));
export default function SignUp() {
    const isLogged = useContext(authContext);
    const navigate = useNavigate();
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseErr] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const userPersonalData = useRef({
        name: "",
        userName: "",
        email: "",
        password: "",
        secondPassword: "",
        isChecked: false
    });
  
    function validateSignUpForm(e) {
        e.preventDefault();
        if (validateForm(userPersonalData.current, setValidateErr)) {
            setLoadingState(true);
            createAccount();
        };
    }

    function createAccount() {
        createUserWithEmailAndPassword(auth, userPersonalData.current.email, userPersonalData.current.password).then(() => {
            fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}create-user`, {
                method: "POST",
                body: `name=${userPersonalData.current.name}&email=${userPersonalData.current.email}&userName=${userPersonalData.current.userName}&isPaying=true&isNew=true`,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            })
                .then(response => {
                    if (response.status !== 201) {
                        throw Error("Failed To Create Account");
                    }
                    else if (response.status === 201) {
                        navigate('/onboard');
                    }
                })
                .catch(err => {
                    deleteUser(auth.currentUser).catch(error => {
                        validateCallback([getFirebaseErr],error.message,setFirebaseErr);
                        setLoadingState(false);
                    })
                    validateCallback([setValidateErr],err.message);
                    setLoadingState(false);
                });
        }).then(() => {
            sendEmailVerification(auth.currentUser).then(() => {
                validateCallback([setFirebaseErr, setValidateErr], false);
            })
                .catch((err) => {
                    validateCallback([getFirebaseErr], err.message, setFirebaseErr);
                    setLoadingState(false);
                })
            updateProfile(auth.currentUser, { displayName: userPersonalData.current.nickName }).catch(err => {
                validateCallback([getFirebaseErr], err.message, setFirebaseErr);
                setLoadingState(false);
            })
        }).catch((err) => {
            validateCallback([getFirebaseErr], err.message, setFirebaseErr);
            setLoadingState(false);
        })
    }

    return (
        <div className="sign-up-page">
            <Suspense fallback={<Loader />}>
                <Header />
                <AuthContainer heading="Sign Up To CreateBoss">
                    <AuthForm>
                        <input type="text" placeholder="Your Name" onChange={(e) => userPersonalData.current.name = e.target.value} required />
                        <input type="text" placeholder="Your Username" onChange={(e) => userPersonalData.current.userName = e.target.value} required />
                        <input type="email" placeholder="Your E-Mail" onChange={(e) => userPersonalData.current.email = e.target.value} required />
                        <input type="password" placeholder="Your Password" onChange={(e) => userPersonalData.current.password = e.target.value} required />
                        <input type="password" placeholder="Repeat Password" onChange={(e) => userPersonalData.current.secondPassword = e.target.value} required />
                        {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : null}
                        <TermsCheckbox onChange={() => {userPersonalData.current.isChecked = !userPersonalData.current.isChecked}}/>
                        <CtaButton text="Sign Up" action={validateSignUpForm} />
                    </AuthForm>
                    {loadingState ? <Loader /> : null}
                </AuthContainer>
                <Footer />
            </Suspense>
        </div>
    )
}