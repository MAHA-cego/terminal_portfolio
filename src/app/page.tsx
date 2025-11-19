"use client";

import Terminal from "@/components/Terminal/Terminal";

export default function Home() {
  return (
    <div className="h-screen w-full flex">
      <main className="flex flex-col h-full w-full min-h-0 p-2">
        <Terminal />
      </main>
    </div>
  );
}
