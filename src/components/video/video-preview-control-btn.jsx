import { forwardRef } from "react"
import { Picture } from "../picture"

export const VideoPreviewControlBtn = forwardRef((props,ref) => {
    return (
        <button onClick={() => { props.sign === "+" ? ref.current.currentTime = ref.current.currentTime + 15 : ref.current.currentTime = ref.current.currentTime - 15 }}>
            <Picture images={props.images} alt={props.alt} imgWidth={props.imgWidth} imgHeight={props.imgHeight} />
        </button>
    )
})
