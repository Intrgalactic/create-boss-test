import { SectionHeading } from "src/components/section-heading";

export function AuthContainer({children,heading}) {
    return (
        <div className="auth-container">
            <SectionHeading heading={heading} />
            {children}
        </div>
    )
}