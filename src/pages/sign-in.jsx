import { EmailAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
import { CtaButton } from "src/components/cta-button";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import { getFirebaseErr, validateCallback, validateForm } from "src/utils/utilities";
import { auth } from "../../firebase.js";
import Loader from "src/layouts/loader.jsx";
export default function SignIn() {
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseError] = useState();
    const [loadingState, setLoadingState] = useState(false);
    const userData = useRef({
        email: "",
        password: "",
    })
    function validateLoginForm(e) {
        e.preventDefault();
        console.log(userData);
        const userCredentials = EmailAuthProvider.credential(userData.current.email,userData.current.password);
        if (validateForm(userData.current,setValidateErr)) {
            setLoadingState(true);
            signInWithCredential(auth,userCredentials)
            .catch(err => {
                console.log(err.message);
                validateCallback([getFirebaseErr],err.message,setFirebaseError);
                setLoadingState(false);
            })
        }
    }
    return (
        <div className="sign-in-page">
            <Header/>
            <AuthContainer heading="Login To CreateBoss Dashboard">
                <AuthForm>
                    <input type="email" placeholder="Your E-Mail" onChange={(e) => {userData.current.email = e.target.value}}/>
                    <input type="password" placeholder="Your Password" onChange={(e) => {userData.current.password = e.target.value}}/>
                    {validateErr ? <font className="auth-form__err">{validateErr}</font> : firebaseErr ? <font className="auth-form__err">{firebaseErr}</font> : null}
                    <Link to='/sign-up'>Don’t have account yet? Join to CreateBoss today!</Link>
                    <CtaButton text="Login" action={validateLoginForm}/>
                </AuthForm>
                {loadingState ? <Loader/> : null}
            </AuthContainer>
            <Footer/>
        </div>
    )
}