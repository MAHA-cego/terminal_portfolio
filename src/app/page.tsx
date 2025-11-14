'use client'

import Terminal from "@/components/Terminal/Terminal";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col text-md p-2 leading-5 tracking-[0.08em]">
        <Terminal />
      </main>
    </div>
  );
}