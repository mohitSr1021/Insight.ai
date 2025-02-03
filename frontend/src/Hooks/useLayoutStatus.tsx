import { useState, useEffect } from 'react';

const useLayoutStatus = () => {
    const [breakpoint, setBreakpoint] = useState({
        xs: window.innerWidth < 640,
        sm: window.innerWidth >= 640 && window.innerWidth < 768,
        md: window.innerWidth >= 768 && window.innerWidth < 1024,
        lg: window.innerWidth >= 1024 && window.innerWidth < 1280,
        xl: window.innerWidth >= 1280 && window.innerWidth < 1536,
        '2xl': window.innerWidth >= 1536,
        current: ''
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newBreakpoint = {
                xs: width < 640,
                sm: width >= 640 && width < 768,
                md: width >= 768 && width < 1024,
                lg: width >= 1024 && width < 1280,
                xl: width >= 1280 && width < 1536,
                '2xl': width >= 1536,
                current: width < 640 ? 'xs' :
                    width < 768 ? 'sm' :
                        width < 1024 ? 'md' :
                            width < 1280 ? 'lg' :
                                width < 1536 ? 'xl' :
                                    '2xl'
            };

            setBreakpoint(newBreakpoint);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};

export default useLayoutStatus;