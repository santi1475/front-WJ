"use client";

import * as React from "react";

const BREAKPOINTS = {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
};

export function useResponsive() {
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    const [isTablet, setIsTablet] = React.useState<boolean>(false);
    const [isDesktop, setIsDesktop] = React.useState<boolean>(true);

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < BREAKPOINTS.tablet);
            setIsTablet(width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop);
            setIsDesktop(width >= BREAKPOINTS.desktop);
        };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

    return { isMobile, isTablet, isDesktop };
}
