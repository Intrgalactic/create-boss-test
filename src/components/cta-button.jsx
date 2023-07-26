
export function CtaButton({text,action}) {
    return (
        <button className="call-to-action-btn" onClick={action}>
            {text}
        </button>
    )
}