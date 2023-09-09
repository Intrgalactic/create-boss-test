import { Link } from "react-router-dom";

export function ServiceInstruction({heading,steps}) {
    return (
        <div className="service-instruction">
            <h3>{heading}</h3>
            <ul>
                {steps.map((step,index) => (
                    <li key={index}>{typeof(step) === 'object' ? <>{step.text} <Link to={step.href}>Here</Link></>: step}</li>
                ))}
            </ul>
        </div>
    )
}