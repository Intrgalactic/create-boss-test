import { motion } from "framer-motion"
import { useMemo } from "react";
import { useLocation } from "react-router-dom"

export function SectionHeading({heading}) {
    const location = useMemo(() => {return useLocation()});
    const sentence = {
        hidden: {opacity:1},
        visible: {
            opacity:1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.02
            }
        }
    }
    const letter = {
        hidden: {opacity:0, y:50},
        visible: {
            opacity: 1,
            y:0
        }
    }
    return (
        <motion.h2 className="section-heading" variants={sentence} initial="hidden" whileInView={!location.pathname.includes("dashboard") && "visible"} animate={location.pathname.includes('dashboard') && "visible"}>{
            heading.split("").map((char,index) => (
                <motion.span key={index} variants={letter}>{char}</motion.span>
            ))
        }</motion.h2>
    )
}