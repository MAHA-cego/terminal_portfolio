"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { number } from "framer-motion";
import WindowTopBar from "./WindowTopBar";

export default function WindowFrame({
  title,
  children,
  initialWidth = 400,
  initialHeight = 300,
  extraHeight = 0,
  closeIcon,
  aspectRatio,
  onChromeHeight,
}: {
  title: string;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  extraHeight?: number;
  closeIcon: string;
  aspectRatio?: number | null;
  onChromeHeight?: (height: number) => void;
}) {
  const topBarRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [chromeHeight, setChromeHeight] = useState(0);

  const [pos, setPos] = useState({ x: 120, y: 90 });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  // vertical decoration accounts for `border-2` (2px top+bottom) and
  // `p-px` (1px top+bottom) used on the root element -> total 6px
  const VERTICAL_DECORATION = 6;

  useLayoutEffect(() => {
    if (topBarRef.current) {
      const h = topBarRef.current.getBoundingClientRect().height;
      setChromeHeight(h);
      onChromeHeight?.(h);
    }
  }, []);

  // Track whether the user has manually resized the window. If they have,
  // avoid overwriting their size when props change.
  const hasUserResized = useRef(false);

  // If the parent later provides a new initial size (for example after
  // measuring controls or chrome), update our internal size unless the
  // user already resized the window.
  useEffect(() => {
    if (hasUserResized.current) return;
    // account for the window chrome/border/padding declared in Tailwind:
    // `border-2` (2px top + 2px bottom) and `p-px` (1px top + 1px bottom)
    // -> total vertical decoration = 6px. Without this, the outer box
    // height will end up a few pixels short of the inner content.
    const VERTICAL_DECORATION = 6;
    setSize({
      width: initialWidth,
      height: Math.round(initialHeight + VERTICAL_DECORATION),
    });
  }, [initialWidth, initialHeight]);

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

  const startResize = (e: React.MouseEvent, direction: "right" | "bottom" | "corner") => {
    e.stopPropagation();

    resizeData.current = {
      startX: e.clientX,
      startY: e.clientY,
      w: size.width,
      h: size.height,
    };

    // mark that the user is about to resize so we don't stomp their choice
    hasUserResized.current = true;

    window.addEventListener("mousemove", (ev) => onResize(ev, direction));
    window.addEventListener("mouseup", endResize, { once: true });
  };

  const onResize = (e: MouseEvent, direction: "right" | "bottom" | "corner") => {
    if (!resizeData.current) return;

    const dx = e.clientX - resizeData.current.startX;
    const dy = e.clientY - resizeData.current.startY;

    let newWidth = resizeData.current.w;
    let newHeight = resizeData.current.h;

    if (aspectRatio) {
      if (direction === "right") {
        newWidth = Math.max(200, resizeData.current.w + dx);
        const videoHeight = Math.round(newWidth / aspectRatio);
        newHeight = videoHeight + extraHeight + chromeHeight + VERTICAL_DECORATION;
      } else if (direction === "bottom") {
        // compute the content (video) height from the overall window height
        const startingContentHeight =
          resizeData.current.h - (extraHeight + chromeHeight + VERTICAL_DECORATION);
        const videoHeight = Math.max(100, startingContentHeight + dy);
        newHeight = videoHeight + extraHeight + chromeHeight + VERTICAL_DECORATION;
        newWidth = Math.round(videoHeight * aspectRatio);
      } else if (direction === "corner") {
        newWidth = Math.max(200, resizeData.current.w + dx);
        const videoHeight = Math.round(newWidth / aspectRatio);
        newHeight = videoHeight + extraHeight + chromeHeight + VERTICAL_DECORATION;
      }
    }

    setSize({ width: newWidth, height: newHeight });
  };

  const endResize = () => {
    resizeData.current = null;
  };

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col border-2 border-white bg-black select-none p-px box-border"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
      }}
    >
      <div ref={topBarRef}>
        <WindowTopBar title={title} onMouseDown={onDragStart} img={closeIcon} />
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>

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
        className="absolute right-0 bottom-0 w-3 h-3 cursor-nwse-resize"
      />
    </div>
  );
}
