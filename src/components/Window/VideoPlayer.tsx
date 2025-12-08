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
  onControlsHeight,
}: {
  src: string;
  aspectRatio: number;
  playIcon: string;
  pauseIcon: string;
  stopIcon: string;
  fwdIcon: string;
  fScreenIcon: string;
  onControlsHeight?: (height: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!controlsRef.current) return;

    const h = controlsRef.current.getBoundingClientRect().height;
    onControlsHeight?.(h);
  }, []);

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);

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
    videoRef.current?.requestFullscreen();
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const onChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const p = Number(e.target.value);
    v.currentTime = (p / 100) * v.duration;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 bg-black relative">
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
        className="h-6 flex items-center bg-neutral-900 text-white border-t-2 border-white"
      >
        <button className="border-r-2 border-white w-12  min-w-12" onClick={togglePlay}>
          {paused ? (
            <img className="h-6 w-6" src={playIcon} alt="Play" />
          ) : (
            <img className="h-6 w-6" src={pauseIcon} alt="Pause" />
          )}
        </button>
        <button className="border-r-2 border-white w-6" onClick={stop}>
          <img className="h-6 w-6  min-w-6" src={stopIcon} alt="Stop" />
        </button>
        <button className="border-r-2 border-white w-6  min-w-6" onClick={() => seek(-5)}>
          <img className="h-6 w-6  min-w-6 rotate-180" src={fwdIcon} alt="Backward 5s" />
        </button>
        <input
          type="range"
          className="flex-1 h-6 appearance-none range-none focus:outline-none"
          value={progress}
          onChange={onChangeProgress}
        />
        <button className="border-l-2 border-white w-6" onClick={() => seek(5)}>
          <img className="h-6 w-6 min-w-6" src={fwdIcon} alt="Forward 5s" />
        </button>
        <button className="border-l-2 border-white w-6  min-w-6" onClick={goFullScreen}>
          <img className="h-[22px] w-[22px" src={fScreenIcon} alt="Full Screen" />
        </button>
      </div>
    </div>
  );
}
