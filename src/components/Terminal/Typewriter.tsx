'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Typewriter({
    text,
    speed = 0.02,
    delay = 0,
    className = "",
    onComplete,
    scrollContainer,
}: {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    onComplete?: () => void;
    scrollContainer?: React.RefObject<HTMLDivElement | null>;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.innerHTML = "";

        const chars = text.split("");
        const state = { i: 0 };

        const tween = gsap.to(state, {
                i: chars.length,
                delay,
                duration: chars.length * speed,
                ease: "none",
                onUpdate() {
                    const n = Math.floor(state.i);
                    el.innerHTML = chars
                    .slice(0, n)
                    .join("")
                    .replace(/\n/g, "<br>");

                    if (scrollContainer?.current) {
                        const sc = scrollContainer.current;
                        sc.scrollTop = sc.scrollHeight;
                    }
                },
                onComplete,
            });
            return () => {
                tween.kill();
            }
}, [text]);

    return (
        <div className={`whitespace-pre-wrap ${className}`} ref={ref}></div>
    );
}