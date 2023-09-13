import loadable from "@loadable/component";
import { Suspense, lazy, useContext, useRef, useState } from "react";
const AuthContainer = lazy(() => import("src/components/auth/auth-container.jsx").then(module => {return { default: module.AuthContainer }}));
const AuthForm = lazy(() => import("src/components/auth/auth-form").then(module => {return { default: module.AuthForm }}));
const Header = loadable(() => import("src/layouts/header"));
import { auth } from "../../firebase.js";
const Loader = loadable(() => import("src/layouts/loader"));
const TermsCheckbox = lazy(() => import('src/components/terms-label').then(module => {
    return {default :module.TermsCheckbox}
}))
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
  
    async function validateSignUpForm(e) {
        e.preventDefault();
        if ((await import("src/utils/utilities")).validateForm(userPersonalData.current, setValidateErr)) {
            setLoadingState(true);
            createAccount();
        };
    }

    async function createAccount() {
        (await import('firebase/auth')).createUserWithEmailAndPassword(auth, userPersonalData.current.email, userPersonalData.current.password).then(() => {
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
                .catch(async err => {
                    (await import("firebase/auth")).deleteUser(auth.currentUser).catch(async error => {
                        (await import("src/utils/utilities")).validateCallback([(await import("src/utils/utilities")).getFirebaseErr],error.message,setFirebaseErr);
                        setLoadingState(false);
                    })
                    (await import("src/utils/utilities")).validateCallback([setValidateErr],err.message);
                    setLoadingState(false);
                });
        }).then(async () => {
            (await import("firebase/auth")).sendEmailVerification(auth.currentUser).then(async () => {
                (await import("src/utils/utilities")).validateCallback([setFirebaseErr, setValidateErr], false);
            })
                .catch(async (err) => {
                    (await import("src/utils/utilities")).validateCallback([(await import("src/utils/utilities")).getFirebaseErr], err.message,setFirebaseErr);
                    setLoadingState(false);
                })
            (await import("firebase/auth")).updateProfile(auth.currentUser, { displayName: userPersonalData.current.nickName }).catch(async err => {
                (await import("src/utils/utilities")).validateCallback([(await import("src/utils/utilities")).getFirebaseErr], err.message,setFirebaseErr);
                setLoadingState(false);
            })
        }).catch(async (err) => {
            (await import("src/utils/utilities")).validateCallback([(await import("src/utils/utilities")).getFirebaseErr], err.message,setFirebaseErr);
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