"use client";

import React, { useEffect, useState, useRef } from "react";
import Input from "@/components/Terminal/Input";
import Initialization from "@/components/Terminal/Initialization";
import Output from "@/components/Terminal/Output";
import { commandParser } from "@/utils/commandParser";

export default function Terminal() {
    const [history, setHistory] = useState<string[]>([]);
    const [bootComplete, setBootComplete] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setBootComplete(true), 900);
        return () => clearTimeout(t);
    }, []);

    const handleSubmit = (command: string) => {
        if (!command) return;

        const result = commandParser(command);

        if (result === "__CLEAR__") {
            setHistory([]);
            return;
        }

        setHistory((h) => [...h, `> ${command}`, result]);
    };

    return (
        <main className="flex flex-col h-full w-full text-md leading-5 tracking-[0.08em]">
            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto scrollbar-hide"
            >
                <Initialization />
                {bootComplete && (
                    <Output history={history} scrollContainer={scrollRef} />
                )}
                <Input onSubmit={handleSubmit} />
            </div>
        </main>
    );
}
