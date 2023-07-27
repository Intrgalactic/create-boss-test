import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from "firebase/auth";
import { Suspense, lazy, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
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
        lastName: "",
        userName: "",
        email: "",
        password: "",
        secondPassword: "",
        isChecked: false
    });
    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
    })
    function validateSignUpForm(e) {
        e.preventDefault();
        if (validateForm(userPersonalData.current, setValidateErr)) {
            setLoadingState(true);
            createAccount();
        };
    }

    function createAccount() {
        console.log(`${import.meta.env.VITE_SERVER_FETCH_URL}create-user?name=${userPersonalData.current.name}&lastName=${userPersonalData.current.lastName}&email=${userPersonalData.current.email}&userName=${userPersonalData.current.userName}`);
        createUserWithEmailAndPassword(auth, userPersonalData.current.email, userPersonalData.current.password).then(() => {
            fetch(`${import.meta.env.VITE_SERVER_FETCH_URL}create-user`, {
                method: "POST",
                body: `name=${userPersonalData.current.name}&lastName=${userPersonalData.current.lastName}&email=${userPersonalData.current.email}&userName=${userPersonalData.current.userName}&isPaying=false`,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            })
                .then(response => {
                    if (response.status !== 201) {
                        throw Error("Failed To Create Account");
                    }
                    else if (response.status === 201) {

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
                        <input type="text" placeholder="Your Last Name" onChange={(e) => userPersonalData.current.lastName = e.target.value} required />
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