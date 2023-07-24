
export function scrollWithTimeout(childrens, timeout) {
    for (let i = 1; i < childrens.childNodes.length; i++) {
        setTimeout(() => {
            childrens.childNodes[i].scrollIntoView({ behavior: "smooth", inline: "nearest", block: "center" });
        }, timeout);
        timeout += 2000;
    }
}
export function destroyObserving(controller, setIsScrollingDone, length) {
    setTimeout(() => {
        controller.abort();
        setIsScrollingDone(true);
    }, length * 2000);
}

export function detectIsElementVisible(isVisible, ref, controller, setIsScrollingDone,timeout) {
    if (isVisible) {
        const childrens = ref.current.classList.contains("benefits-section__container") ? ref.current.querySelector(".benefits-section__pre-container").childNodes[1]: ref.current.childNodes[1];
     
        window.addEventListener("scroll", function preventScroll() {
            ref.current.scrollIntoView({ behavior: "instant", inline: "nearest", block: "center" });
        }, { signal: controller.signal });
        const length = window.innerWidth < 512 ? childrens.childNodes.length : childrens.childNodes.length / 2;
        scrollWithTimeout(childrens, timeout);
        destroyObserving(controller, setIsScrollingDone, length);
    }
}

export function launchObserver(ref, isScrollingDone, observer) {
    if (ref.current && !isScrollingDone) {
        if (window.innerWidth <= 768) {
            observer.observe(ref.current);
        }
    }
    else if (isScrollingDone && ref.current) {
        observer.unobserve(ref.current);
    }

    return () => {
        observer.unobserve(ref.current);
    }
}