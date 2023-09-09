import { useEffect, useRef } from "react"

export function SelectButton({heading,setSelectedCategory,selectedCategory}) {
    const buttonRef = useRef();
    useEffect(() => {
        if (heading === selectedCategory) {
            buttonRef.current.classList.add("selected-voice-destiny");
        }
        else {
            buttonRef.current.classList.remove("selected-voice-destiny");
        }
    },[selectedCategory])
    return (
        <button onClick={() => heading === selectedCategory ? setSelectedCategory("") : setSelectedCategory(heading)} ref={buttonRef}>
            {heading}
        </button>
    )
}