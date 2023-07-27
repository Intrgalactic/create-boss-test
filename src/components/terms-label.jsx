
export function TermsCheckbox({onChange}) {
    return (
        <label>
            <input type="checkbox" onChange={onChange}/>
            <p>have read the cancellation policy and agree with the terms and conditions.</p>
        </label>
    )
}