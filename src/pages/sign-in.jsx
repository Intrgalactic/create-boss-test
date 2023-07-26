import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
import { CtaButton } from "src/components/cta-button";
import Footer from "src/layouts/footer";
import Header from "src/layouts/header";
import { validateForm } from "src/utils/utilities";

export default function SignIn() {
    const [validateErr, setValidateErr] = useState();
    const [firebaseErr, setFirebaseError] = useState();
    const userData = useRef({
        email: "",
        password: "",
    })
    function validateLoginForm(e) {
        e.preventDefault();
        if (validateForm(userData.current,setValidateErr)) {

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
            </AuthContainer>
            <Footer/>
        </div>
    )
}