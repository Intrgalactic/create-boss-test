import { useRef, useState } from "react"

export function FaqRecord({question,answer}) {
    const answerRef = useRef();
    const [isOpened,setIsOpened] = useState(false);
    function unHideRecord() {
        answerRef.current.classList.toggle("visible-record");
        setIsOpened(!isOpened);
    }
    return (
        <div className="faq__record" onClick={unHideRecord}>
            <div className="faq__record-heading">
                <h3  >{question}</h3>
                <div className="plus-sign">{!isOpened ? <>&#43;</> : <>&minus;</>}</div>
            </div>
            <p ref={answerRef}>{answer}</p>
        </div>
    )
}