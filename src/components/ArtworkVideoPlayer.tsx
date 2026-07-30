"use client";

import {useRef, useState} from "react";

type ArtworkVideoPlayerProps = {
  autoplay?: boolean | null;
  loop?: boolean | null;
  mimeType?: string | null;
  muted?: boolean | null;
  src: string;
};

export function ArtworkVideoPlayer({
  autoplay,
  loop,
  mimeType,
  muted,
  src,
}: ArtworkVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasRequestedPreview = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const shouldAutoplay = Boolean(autoplay);
  const shouldMute = shouldAutoplay || Boolean(muted);

  function handleLoadedMetadata() {
    const video = videoRef.current;

    if (
      video &&
      !shouldAutoplay &&
      !hasRequestedPreview.current &&
      Number.isFinite(video.duration) &&
      video.duration > 0.1
    ) {
      hasRequestedPreview.current = true;

      try {
        video.currentTime = 0.1;
      } catch {
        setIsReady(true);
      }
    }
  }

  function handleLoadedData() {
    setIsReady(true);
  }

  function handleSeeked() {
    if (!shouldAutoplay) {
      videoRef.current?.pause();
    }

    setIsReady(true);
  }

  function handleError() {
    setIsReady(true);

    if (process.env.NODE_ENV === "development") {
      console.error("Artwork video failed to load", {
        mimeType,
        src,
      });
    }
  }

  return (
    <div className="artwork-video-frame w-full">
      {!isReady ? (
        <div className="artwork-video-loading">
          <span>视频加载中</span>
        </div>
      ) : null}
      <video
        autoPlay={shouldAutoplay}
        className={`artwork-video ${isReady ? "" : "artwork-video--preload"}`}
        controls
        loop={Boolean(loop)}
        muted={shouldMute}
        onCanPlay={handleLoadedData}
        onError={handleError}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        playsInline
        preload="auto"
        ref={videoRef}
      >
        <source
          src={src}
          type={mimeType || "video/mp4"}
        />
      </video>
    </div>
  );
}
