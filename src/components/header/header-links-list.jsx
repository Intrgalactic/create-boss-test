import expandImage from 'src/assets/images/expand-2.png';
import webpExpandImage from 'src/assets/images/expand-2.webp';
import { Picture } from '../picture';
import { useRef, useState } from 'react';
import { expandList } from 'src/utils/utilities';

export function HeaderLinksList({ heading, children }) {
    const [isToggled,setIsToggled] = useState(false);
    const headingRef = useRef();
    const linksRef = useRef();
    const listRef = useRef();
    function toggleHeaderLinksList() {
        if (!isToggled) {
            listRef.current.style.height = "fit-content";
        }
        else {
            listRef.current.style.height = "44.8px";

        }
        expandList(isToggled,setIsToggled,linksRef,"expanded-header-links",headingRef);
    }
    return (
        <div className="links-list" ref={listRef} onClick={toggleHeaderLinksList}>
            <div className="links-list__heading" ref={headingRef} >
                <p>{heading}</p>
                <Picture images={[webpExpandImage, expandImage]} alt="expand arrow" imgHeight="21px" imgWidth="20px" />
            </div>
            <div className="links-list__links" ref={linksRef}>
                {children}
            </div>
        </div>
    )
}
