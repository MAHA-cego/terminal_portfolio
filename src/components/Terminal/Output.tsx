import React, { useEffect, useRef } from "react";

export default function Output({ history }: { history: string[] }) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [history]);
    return (
        <div ref={ref}
        className="whitespace-pre-wrap mt-2 mb-2 max-h-[50vh] overflow-y-auto"
        aria-live="polite">
            {history.map((line, i) => {
                const isMultiline = line.includes('\n');
                return (
                    <p key={i} className={isMultiline ? 'mb-2' : ''}>{line}</p>
                );
            })}
        </div>
    );
}