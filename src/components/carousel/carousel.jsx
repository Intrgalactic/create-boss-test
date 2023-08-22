import { forwardRef, useEffect, useState } from "react";
import { CarouselButton } from "./carousel-button";
import { motion } from "framer-motion";

export const Carousel = forwardRef((props, ref) => {
    const [scrollCount, setScrollCount] = useState(1);
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    var elementsToScroll;
    useEffect(() => {
        setScrollCount(0);
        window.addEventListener("resize", handleWindowResize);
        if (ref.current) {
            elementsToScroll = ref.current.querySelector("div").childNodes;
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
            checkClassListAndScroll(elementsToScroll, "-",scrollCount - 2 >= 0)
        }
        else if (e.target.classList.contains("right-carousel-button") && scrollCount + 1 < elementsToScroll.length) {
            checkClassListAndScroll(elementsToScroll, "+",scrollCount + 2 < elementsToScroll.length);
        }
        else {
            e.target.classList.contains("right-carousel-button") ? elementsToScroll[0].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }) : elementsToScroll[elementsToScroll.length - 1].scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            e.target.classList.contains("right-carousel-button") ? setScrollCount(0) : setScrollCount(elementsToScroll.length - 1);
        }
    }
    function checkClassListAndScroll(elementsToScroll, sign,condition) {
        if (condition === true && window.innerWidth > 768) {
            if (elementsToScroll[0].classList.contains("pricing__box") && windowSize > 1024) {
                console.log('fire 0');
                scrollToElem(3, elementsToScroll, sign)
            }
            else if (elementsToScroll[0].classList.contains("pricing__box")) {
                console.log('fire 1');
                scrollToElem(1, elementsToScroll,sign);
            }
            else {
                console.log('fire 2');
                scrollToElem(2, elementsToScroll, sign);
            }
        }
        else {
            console.log('fire 3');
            scrollToElem(1, elementsToScroll, sign);
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
        <motion.div className="carousel" initial={{opacity:0}} whileInView={{opacity:1}} ref={ref}>
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
        </motion.div>
    )
});

