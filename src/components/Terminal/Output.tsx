"use client";

import React, { useEffect, useRef } from "react";
import Typewriter from "@/components/Terminal/Typewriter";

export default function Output({
    history,
    scrollContainer
}: {
    history: string[];
    scrollContainer: React.RefObject<HTMLDivElement | null>;
}) {
    
    return (
        <div className="whitespace-pre-wrap">
          {history.map((line, i) => (
            <Typewriter
              key={i}
              text={line}
              speed={0.01}
              scrollContainer={scrollContainer}
              className="mb-1"
            />
          ))}
        </div>
    );
}