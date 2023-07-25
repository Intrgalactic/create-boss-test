import { AuthForm } from "./auth-form";
import { SectionHeading } from "./section-heading";

export function AuthContainer({children,heading}) {
    return (
        <div className="auth-container">
            <SectionHeading heading={heading} />
            {children}
        </div>
    )
}