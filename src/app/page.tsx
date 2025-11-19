"use client";

import Terminal from "@/components/Terminal/Terminal";
import ImageWindow from "@/components/Window/ImageWindow";

export default function Home() {
  return (
    <div className="h-screen w-full flex">
      <main className="flex flex-col h-full w-full min-h-0 p-2">
        <Terminal />
        <ImageWindow src="/media/images/Noodles.png" title="imgtitle.png" />
      </main>
    </div>
  );
}
