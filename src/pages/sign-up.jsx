import { createUserWithEmailAndPassword } from "firebase/auth";
import { Suspense, lazy, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
import Header from "src/layouts/header";
import { validateForm } from "src/utils/utilities";
const Loader = lazy(() => import('src/layouts/loader'));
const CtaButton = lazy(() => import('src/components/cta-button').then(module => {
    return {default: module.CtaButton}
}))
const Footer = lazy(() => import('src/layouts/footer'));
export default function SignUp() {
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseErr] = useState();
    const [successState,setSuccessState] = useState(false);
    const userPersonalData = useRef({
        name: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        secondPassword: ""
    });
    function validateSignUpForm(e) {
        e.preventDefault();
        if (validateForm(userPersonalData.current,setValidateErr)) {
            setSuccessState(true);
            
        };
    }
    function CreateAccount() {
        createUserWithEmailAndPassword()
    }
    return (
        <div className="sign-up-page">
            <Suspense fallback={<Loader/>}>
            <Header />
            <AuthContainer heading="Sign Up To CreateBoss">
                <AuthForm>
                    <input type="text" placeholder="Your Name" onChange={(e) => userPersonalData.current.name = e.target.value} required/>
                    <input type="text" placeholder="Your Last Name" onChange={(e) => userPersonalData.current.lastName = e.target.value} required/>
                    <input type="text" placeholder="Your Username" onChange={(e) => userPersonalData.current.userName = e.target.value} required/>
                    <input type="email" placeholder="Your E-Mail" onChange={(e) => userPersonalData.current.email = e.target.value} required/>
                    <input type="password" placeholder="Your Password" onChange={(e) => userPersonalData.current.password = e.target.value} required/>
                    <input type="password" placeholder="Repeat Password" onChange={(e) => userPersonalData.current.secondPassword = e.target.value} required/>
                    {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : null}
                    <Link to='/sign-up'>Don’t have account yet? Join to CreateBoss today!</Link>
                    <CtaButton text="Sign Up" action={validateSignUpForm}/>
                </AuthForm>
                {successState ? <Loader/> : null}
            </AuthContainer>
            <Footer />
            </Suspense>
        </div>
    )
}