"use client";

import WindowButton from "./WindowButton";

export default function WindowTopBar({
  title,
  onMouseDown,
  img,
}: {
  title: string;
  onMouseDown: (e: React.MouseEvent) => void;
  img: string;
}) {
  return (
    <div
      className="h-6 bg-black text-white flex items-center cursor-move select-none gap-px mb-px"
      onMouseDown={onMouseDown}
    >
      <span className="border-2 border-white h-6 w-full pl-4 text-sm">
        {title}
      </span>
      <WindowButton img={img} />
    </div>
  );
}
