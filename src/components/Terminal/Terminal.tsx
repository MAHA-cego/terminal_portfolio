"use client";

import { useState } from "react";
import Input from "@/components/Terminal/Input";
import Initialization from "@/components/Terminal/Initialization";
import Output from "@/components/Terminal/Output";
import { commandParser } from "@/utils/commandParser";

export default function Terminal() {
    const [history, setHistory] = useState<string[]>([]);

    const handleSubmit = (command: string) => {
        const result = commandParser(command);
        setHistory((h) => [...h, `> ${command}`, result]);
    };

  return (
    <>
        <main className="flex flex-col text-md pd-2 leading-5 tracking-[0.08em]">
            <Initialization />
            <Output history={history}/>
            <Input onSubmit={handleSubmit} />
        </main>
    </>
  );
}