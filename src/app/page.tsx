"use client";

import Terminal from "@/components/Terminal/Terminal";
import ImageWindow from "@/components/Window/ImageWindow";
import VideoWindow from "@/components/Window/VideoWindow";

export default function Home() {
  return (
    <div className="h-screen w-full flex">
      <main className="flex flex-col h-full w-full min-h-0 p-2">
        <Terminal />
        <ImageWindow src="/media/images/Noodles.png" title="imgtitle.png" />
        <VideoWindow src="/media/videos/pfiou1.mp4" title="videotitle.mp4" />
      </main>
    </div>
  );
}
