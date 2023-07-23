import { forwardRef, useEffect, useState } from "react";
import { CarouselButton } from "./carousel-button";

export const Carousel = forwardRef((props, ref) => {
    const [scrollCount, setScrollCount] = useState(1);
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    var elementsToScroll;
    useEffect(() => {
        setScrollCount(0);
        window.addEventListener("resize", handleWindowResize);
        if (ref.current) {
            elementsToScroll = ref.current.querySelector("div").childNodes;
            elementsToScroll[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, [setScrollCount, ref.current]);
    function handleWindowResize() {
        setWindowSize(window.innerWidth);
    }
    function scrollToNextElem(e) {

        const elementsToScroll = ref.current.querySelector("div").childNodes;
        if (e.target.classList.contains("left-carousel-button") && scrollCount - 1 >= 0) {
            if (window.innerWidth > 768 && scrollCount - 2 >= 0) {
                if (elementsToScroll[0].classList.contains("pricing__box") && windowSize > 1024) {
                    scrollToElem(3, elementsToScroll, "-")
                }
                else if (elementsToScroll[0].classList.contains("pricing__box")) {
                    scrollToElem(1, elementsToScroll, "-");
                }
                else {
                    scrollToElem(2, elementsToScroll, "-");
                }
            }

            else {
                scrollToElem(1, elementsToScroll, "-");
            }

        }
        else if (e.target.classList.contains("right-carousel-button") && scrollCount + 1 < elementsToScroll.length) {
            if (scrollCount === 0 && window.innerWidth > 768) {
                if (elementsToScroll[0].classList.contains("pricing__box") && windowSize > 1024) {
                    scrollToElem(3, elementsToScroll, "+")
                }
                else if (elementsToScroll[0].classList.contains("pricing__box")) {
                    scrollToElem(1, elementsToScroll, "+");
                }
                else {
                    scrollToElem(2, elementsToScroll, "+");
                }
            }
            else {
                scrollToElem(1, elementsToScroll, "+");
            }
        }
        else {
            e.target.classList.contains("right-carousel-button") ? elementsToScroll[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }) : elementsToScroll[elementsToScroll.length - 1].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            e.target.classList.contains("right-carousel-button") ? setScrollCount(0) : setScrollCount(elementsToScroll.length - 1);
        }
    }
    function scrollToElem(it, elementsToScroll, sign) {
        if (sign === "+") {
            elementsToScroll[scrollCount + it].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            setScrollCount(count => count + it);
        }
        else {
            elementsToScroll[scrollCount - it].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            setScrollCount(count => count - it);
        }
    }
    console.log(scrollCount);
    return (
        <div className="carousel" ref={ref}>
            {windowSize < 512 ?
                <>
                    {props.children}
                    <div className="carousel-buttons-container">
                        <CarouselButton images={props.images} alt={props.alt} imgWidth={props.imgWidth} imgHeight={props.imgHeight} onClick={scrollToNextElem} buttonClass="left-carousel-button" />
                        <CarouselButton images={props.images} alt={props.alt} imgWidth={props.imgWidth} imgHeight={props.imgHeight} onClick={scrollToNextElem} buttonClass="right-carousel-button" />
                    </div>
                </> : null}
            {windowSize > 512 ?
                <>
                    <CarouselButton images={props.images} alt={props.alt} imgWidth={props.imgWidth} imgHeight={props.imgHeight} onClick={scrollToNextElem} buttonClass="left-carousel-button" />
                    {props.children}
                    <CarouselButton images={props.images} alt={props.alt} imgWidth={props.imgWidth} imgHeight={props.imgHeight} onClick={scrollToNextElem} buttonClass="right-carousel-button" />
                </> : null}
        </div>
    )
});

