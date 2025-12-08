"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import WindowFrame from "./WindowFrame";
import WindowScrollArea from "./WindowScrollArea";

export default function VideoWindow({
  src,
  title,
  maxInitialWidth = 500,
  maxInitialHeight = 350,
}: {
  src: string;
  title: string;
  maxInitialWidth?: number;
  maxInitialHeight?: number;
}) {
  const closeIcon = "/icons/closeIcon.png";
  const playIcon = "/icons/playIcon.png";
  const pauseIcon = "/icons/pauseIcon.png";
  const stopIcon = "/icons/stopIcon.png";
  const fwdIcon = "/icons/fwdIcon.png";
  const fScreenIcon = "/icons/fScreenIcon.png";

  const [init, setInit] = useState<{ w: number; h: number; ar: number } | null>(null);

  const [controlsHeight, setControlsHeight] = useState(0);

  const [chromeHeight, setChromeHeight] = useState(0);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;

    video.onloadedmetadata = () => {
      const ar = video.videoWidth / video.videoHeight;

      let w = maxInitialWidth;
      let h = Math.round(w / ar);

      if (h > maxInitialHeight) {
        h = maxInitialHeight;
        w = Math.round(h * ar);
      }

      setInit({ w, h, ar });
    };
  }, [src]);

  if (!init) return null;

  return (
    <WindowFrame
      title={title}
      initialWidth={init.w}
      initialHeight={init.h + controlsHeight + chromeHeight}
      extraHeight={controlsHeight}
      closeIcon={closeIcon}
      aspectRatio={init.ar}
      onChromeHeight={setChromeHeight}
    >
      <WindowScrollArea className="overflow-hidden w-full h-full">
        <div className="relative flex-1 w-full h-full min-h-0">
          <VideoPlayer
            src={src}
            aspectRatio={init.ar}
            playIcon={playIcon}
            pauseIcon={pauseIcon}
            stopIcon={stopIcon}
            fwdIcon={fwdIcon}
            fScreenIcon={fScreenIcon}
            onControlsHeight={setControlsHeight}
          />
        </div>
      </WindowScrollArea>
    </WindowFrame>
  );
}
