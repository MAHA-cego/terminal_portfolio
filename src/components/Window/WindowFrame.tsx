"use client";

import React, { useRef, useState } from "react";
import WindowTopBar from "./WindowTopBar";
import { number } from "framer-motion";

export default function WindowFrame({
  title,
  children,
  initialWidth = 400,
  initialHeight = 300,
  closeIcon,
}: {
  title: string;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  closeIcon: string;
}) {
  const windowRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ x: 120, y: 90 });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  const dragData = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const onDragStart = (e: React.MouseEvent) => {
    const bounds = windowRef?.current?.getBoundingClientRect();
    if (!bounds) return;

    dragData.current = {
      offsetX: e.clientX - bounds.left,
      offsetY: e.clientY - bounds.top,
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragData.current) return;
    setPos({
      x: e.clientX - dragData.current.offsetX,
      y: e.clientY - dragData.current.offsetY,
    });
  };

  const onDragEnd = () => {
    dragData.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
  };

  const resizeData = useRef<{
    startX: number;
    startY: number;
    w: number;
    h: number;
  } | null>(null);

  const startResize = (
    e: React.MouseEvent,
    direction: "right" | "bottom" | "corner",
  ) => {
    e.stopPropagation();

    resizeData.current = {
      startX: e.clientX,
      startY: e.clientY,
      w: size.width,
      h: size.height,
    };

    window.addEventListener("mousemove", (ev) => onResize(ev, direction));
    window.addEventListener("mouseup", endResize, { once: true });
  };

  const onResize = (
    e: MouseEvent,
    direction: "right" | "bottom" | "corner",
  ) => {
    if (!resizeData.current) return;

    const dx = e.clientX - resizeData.current.startX;
    const dy = e.clientY - resizeData.current.startY;

    setSize({
      width:
        direction === "right" || direction === "corner"
          ? Math.max(200, resizeData.current.w + dx)
          : resizeData.current.w,
      height:
        direction === "bottom" || direction === "corner"
          ? Math.max(150, resizeData.current.h + dy)
          : resizeData.current.h,
    });
  };

  const endResize = () => {
    resizeData.current = null;
  };

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col border-2 border-white bg-black select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
      }}
    >
      <WindowTopBar title={title} onMouseDown={onDragStart} img={closeIcon} />

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        {children}
      </div>

      <div
        onMouseDown={(e) => startResize(e, "right")}
        className="absolute right-0 top-0 h-full w-2 cursor-ew-resize"
      />

      <div
        onMouseDown={(e) => startResize(e, "bottom")}
        className="absolute left-0 bottom-0 w-full h-2 cursor-ns-resize"
      />

      <div
        onMouseDown={(e) => startResize(e, "corner")}
        className="absolute right-0 bottom-0 w-3 h-3 bg-black cursor-nwse-resize"
      />
    </div>
  );
}
