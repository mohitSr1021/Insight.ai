import { useEffect } from 'react';

const useIntersectionAnimation = (refs: React.RefObject<HTMLElement[]>) => {
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        refs.current?.forEach((card) => {
            if (card) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.remove("translate-y-4", "opacity-0");
                                entry.target.classList.add("translate-y-0", "opacity-100");
                            }
                        });
                    },
                    {
                        threshold: 0.1,
                        root: null,
                        rootMargin: "0px",
                    }
                );

                observer.observe(card);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [refs]);
};

export default useIntersectionAnimation;