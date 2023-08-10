import { EmailAuthProvider, signInWithCredential } from "firebase/auth";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContainer } from "src/components/auth/auth-container.jsx";
import { AuthForm } from "src/components/auth/auth-form";
import { CtaButton } from "src/components/cta-button";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import { fetchUrl, getFirebaseErr, validateCallback, validateForm } from "src/utils/utilities";
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
    const navigate = useNavigate();
    function validateLoginForm(e) {
        e.preventDefault();
        const userCredentials = EmailAuthProvider.credential(userData.current.email,userData.current.password);
        if (validateForm(userData.current,setValidateErr)) {
            setLoadingState(true);
            signInWithCredential(auth,userCredentials).then(async () => {
                setLoadingState(false);
                const userData = await fetchUrl(`${import.meta.env.VITE_SERVER_FETCH_URL}get-user?email=${auth.currentUser.email}`);
                if (userData.isNew) {
                    navigate('/onboard');
                }
                else {
                    navigate('/dashboard');
                }
            })
            .catch(err => {
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