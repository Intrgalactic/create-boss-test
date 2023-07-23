
export function ContentBox({ heading, description, children,boxClass }) {
    return (
        <div className={`content-box ${boxClass ? boxClass : ''}`}>
            {children}
            <h3>{heading}</h3>
            <p>{description}</p>
        </div>
    )
}