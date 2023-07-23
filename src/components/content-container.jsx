
export function ContentContainer({containerClass,children}) {
    return (
        <div className={`content-container ${containerClass ? containerClass : ''}`}>
            {children }
        </div>
    )
}