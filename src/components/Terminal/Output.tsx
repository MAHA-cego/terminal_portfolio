"use client";

import React, { useEffect, useRef } from "react";
import Typewriter from "@/components/Terminal/Typewriter";

export default function Output({ history }: { history: string[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
         const el = containerRef.current;
         if (!el) return;
         requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
    }, [history]);
    
    return (
        <div ref={containerRef}
        className="whitespace-pre-wrap h-full min-h-0 overflow-y-auto"
        aria-live="polite">
            {history.map((line, i) => (
        <Typewriter
          key={i}
          text={line}
          speed={0.01}
          className="mb-1"
        />
      ))}
        </div>
    );
}