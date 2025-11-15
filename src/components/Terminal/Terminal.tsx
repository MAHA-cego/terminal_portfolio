"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Terminal/Input";
import Initialization from "@/components/Terminal/Initialization";
import Output from "@/components/Terminal/Output";
import { commandParser } from "@/utils/commandParser";

export default function Terminal() {
    const [history, setHistory] = useState<string[]>([]);
    const [bootComplete, setBootComplete] = useState(false);

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
    <>
        <main className="flex flex-col text-md pd-2 leading-5 tracking-[0.08em]">
            <Initialization />
            {bootComplete && <Output history={history} />}
            <Input onSubmit={handleSubmit} placeholder={bootComplete ? "" : "Booting..."} />
        </main>
    </>
  );
}