"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import WindowFrame from "./WindowFrame";
import WindowScrollArea from "./WindowScrollArea";

export default function ImageWindow({
  src,
  title,
  maxInitialWidth = 500,
  maxInitialHeight = 450,
}: {
  src: string;
  title: string;
  maxInitialWidth?: number;
  maxInitialHeight?: number;
}) {
  const closeIcon = "/icons/closeIcon.png";

  const [initialSize, setInitialSize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;

      let width = maxInitialWidth;
      let height = Math.round(width / ratio);

      if (height > maxInitialHeight) {
        height = maxInitialHeight;
        width = Math.round(height * ratio);
      }

      setInitialSize({ w: width, h: height });
    };
  }, [src, maxInitialWidth, maxInitialHeight]);

  if (!initialSize) return null;

  return (
    <WindowFrame
      title={title}
      initialWidth={initialSize.w}
      initialHeight={initialSize.h}
      closeIcon={closeIcon}
    >
      <WindowScrollArea className="overflow-auto w-full h-full">
        <div className="relative flex-1 w-full h-full min-h-0">
          <Image src={src} alt={title} fill className="object-cover"></Image>
        </div>
      </WindowScrollArea>
    </WindowFrame>
  );
}
