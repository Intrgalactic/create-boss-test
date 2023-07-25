import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
import { CtaButton } from "src/components/cta-button";
import Header from "src/layouts/header";

export default function SignIn() {
    return (
        <div className="sign-in-page">
            <Header/>
            <AuthContainer heading="Login To CreateBoss Dashboard">
                <AuthForm>
                    <input type="email" placeholder="Your E-Mail"/>
                    <input type="password" placeholder="Your Password"/>
                    <Link to='/sign-up'>Don’t have account yet? Join to CreateBoss today!</Link>
                    <CtaButton text="Login"/>
                </AuthForm>
            </AuthContainer>
        </div>
    )
}