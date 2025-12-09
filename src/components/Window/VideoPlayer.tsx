"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function VideoPlayer({
  src,
  aspectRatio,
  playIcon,
  pauseIcon,
  stopIcon,
  fwdIcon,
  fScreenIcon,
  fScreenCloseIcon,
  onControlsHeight,
}: {
  src: string;
  aspectRatio: number;
  playIcon: string;
  pauseIcon: string;
  stopIcon: string;
  fwdIcon: string;
  fScreenIcon: string;
  fScreenCloseIcon: string;
  onControlsHeight?: (height: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!controlsRef.current) return;

    const h = controlsRef.current.getBoundingClientRect().height;
    onControlsHeight?.(h);
  }, []);

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPaused(true);
  };

  const seek = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  };

  const goFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || isDragging) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const updateProgressFromEvent = (e: MouseEvent | React.MouseEvent) => {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    let newProgress = ((e.clientX - rect.left) / rect.width) * 100;
    newProgress = Math.max(0, Math.min(100, newProgress));
    const v = videoRef.current;
    if (v) v.currentTime = (newProgress / 100) * v.duration;
    setProgress(newProgress);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateProgressFromEvent(e);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateProgressFromEvent(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const onChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const p = Number(e.target.value);
    v.currentTime = (p / 100) * v.duration;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleEnded = () => {
      setPaused(true);
      setProgress(0);
    };

    v.addEventListener("ended", handleEnded);

    return () => {
      v.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = document.fullscreenElement;
      setIsFullScreen(fsEl === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const displayProgress = isDragging && hoverProgress !== null ? hoverProgress : progress;
  const currentTimeColor = displayProgress >= 2 ? "black" : "white";
  const durationColor = displayProgress >= 98 ? "black" : "white";

  return (
    <div className="flex flex-col w-full h-full" ref={containerRef}>
      <div className="flex-1 bg-black relative border-2 border-white mb-px">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          controls={false}
          onTimeUpdate={onTimeUpdate}
        ></video>
      </div>
      <div
        ref={controlsRef}
        className="h-6 flex items-center bg-neutral-900 text-white border-2 border-white"
      >
        <button
          className="flex items-center justify-center border-r-2 border-white w-12  min-w-12 cursor-pointer"
          onClick={togglePlay}
        >
          {paused ? (
            <img className="h-6 w-6 " src={playIcon} alt="Play" />
          ) : (
            <img className="h-6 w-6" src={pauseIcon} alt="Pause" />
          )}
        </button>
        <button
          className="flex items-center justify-center border-r-2 border-white w-6 cursor-pointer"
          onClick={stop}
        >
          <img className="h-6 w-6  min-w-6" src={stopIcon} alt="Stop" />
        </button>
        <button
          className="flex items-center justify-center border-r-2 border-white w-6  min-w-6 cursor-pointer"
          onClick={() => seek(-5)}
        >
          <img className="h-6 w-6  min-w-6 rotate-180" src={fwdIcon} alt="Backward 5s" />
        </button>
        <div
          ref={progressBarRef}
          id="progress-bar"
          className="flex-1 h-6 relative cursor-pointer"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => isDragging && updateProgressFromEvent(e)}
        >
          <p
            className="absolute top-[50%] translate-y-[-50%] left-2 text-xs select-none"
            style={{
              color: currentTimeColor,
            }}
          >
            {formatTime(
              isDragging
                ? (displayProgress / 100) * (videoRef.current?.duration || 0)
                : videoRef.current?.currentTime || 0,
            )}
          </p>
          <div className="h-6 bg-white" style={{ width: `${progress}%` }}></div>
          <p
            className="absolute top-[50%] translate-y-[-50%] right-2 text-xs select-none"
            style={{
              color: durationColor,
            }}
          >
            {formatTime(videoRef.current?.duration || 0)}
          </p>
        </div>
        <button
          className="flex items-center justify-center border-l-2 border-white w-6 cursor-pointer"
          onClick={() => seek(5)}
        >
          <img className="h-6 w-6 min-w-6" src={fwdIcon} alt="Forward 5s" />
        </button>
        <button
          className="flex items-center justify-center border-l-2 border-white w-6  min-w-6 cursor-pointer"
          onClick={goFullScreen}
        >
          <img
            className="h-[22px] w-[22px]"
            src={isFullScreen ? fScreenCloseIcon : fScreenIcon}
            alt={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          />
        </button>
      </div>
    </div>
  );
}
