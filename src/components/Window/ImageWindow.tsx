"use client";

import WindowFrame from "./WindowFrame";
import WindowScrollArea from "./WindowScrollArea";
import Image from "next/image";

export default function ImageWindow({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const closeIcon = "/icons/closeIcon.png";
  return (
    <WindowFrame
      title={title}
      initialWidth={500}
      initialHeight={450}
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
