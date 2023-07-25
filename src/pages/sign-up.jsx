import { Link } from "react-router-dom";
import { AuthContainer } from "src/components/auth-container";
import { AuthForm } from "src/components/auth-form";
import { CtaButton } from "src/components/cta-button";
import Header from "src/layouts/header";

export default function SignUp() {
    return (
        <div className="sign-up-page">
            <Header />
            <AuthContainer heading="Sign Up To CreateBoss">
                <AuthForm>
                    <input type="text" placeholder="Your Name" />
                    <input type="text" placeholder="Your Last Name" />
                    <input type="text" placeholder="Your Username" />
                    <input type="email" placeholder="Your E-Mail" />
                    <input type="password" placeholder="Your Password" />
                    <input type="password" placeholder="Repeat Password" />
                    <Link to='/sign-up'>Don’t have account yet? Join to CreateBoss today!</Link>
                    <CtaButton text="Sign Up" />
                </AuthForm>
            </AuthContainer>
        </div>
    )
}