"use client";

import {useState, type SyntheticEvent} from "react";

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
  const [videoRatio, setVideoRatio] = useState("16 / 9");
  const shouldAutoplay = Boolean(autoplay);
  const shouldMute = shouldAutoplay || Boolean(muted);

  function handleLoadedMetadata(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    const {currentSrc, duration, videoHeight, videoWidth} = video;

    if (process.env.NODE_ENV === "development") {
      console.log({
        currentSrc,
        duration,
        videoHeight,
        videoWidth,
      });
    }

    if (videoWidth > 0 && videoHeight > 0) {
      setVideoRatio(`${videoWidth} / ${videoHeight}`);
    }
  }

  function handleError() {
    if (process.env.NODE_ENV === "development") {
      console.error("Artwork video failed to load", {
        mimeType,
        src,
      });
    }
  }

  return (
    <div
      className="artwork-video-frame w-full"
      style={{aspectRatio: videoRatio}}
    >
      <video
        autoPlay={shouldAutoplay}
        className="artwork-video"
        controls
        loop={Boolean(loop)}
        muted={shouldMute}
        onError={handleError}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        preload="metadata"
      >
        <source
          src={src}
          type={mimeType || undefined}
        />
      </video>
    </div>
  );
}
