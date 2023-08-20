import { forwardRef } from "react"

export const VideoPreviewControl = forwardRef((props, ref) => {
    return (
        <div className="video-preview__control" onClick={props.onClick} ref={ref}>
            {props.children}
        </div>
    )
})
