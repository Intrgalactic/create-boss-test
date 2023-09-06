import { useEffect, useRef } from "react"

export function SelectButton({heading,setCategory,category}) {
    const buttonRef = useRef();
    useEffect(() => {
        if (category === heading) {
            buttonRef.current.classList.add("selected-voice-destiny");
        }
        else {
            buttonRef.current.classList.remove("selected-voice-destiny");
        }
    },[category])

    console.log(category,heading,buttonRef.current && buttonRef.current.classList);
    return (
        <button onClick={() => setCategory("Voice Category",heading)} ref={buttonRef}>
            {heading}
        </button>
    )
}