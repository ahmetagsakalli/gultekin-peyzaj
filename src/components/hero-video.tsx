"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

const { props: desktopPoster } = getImageProps({
  src: "/images/garden-poster.webp",
  alt: "",
  fill: true,
  sizes: "100vw",
  loading: "eager",
  fetchPriority: "high",
  quality: 65,
});
const { props: mobilePoster } = getImageProps({
  src: "/images/garden-poster-mobile.webp",
  alt: "",
  fill: true,
  sizes: "100vw",
  loading: "eager",
  fetchPriority: "high",
  quality: 65,
});

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const start = () => {
      if (visible && !preference.matches) {
        void video.play().catch(() => {});
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) video.pause();
      else start();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) video.pause();
        else if (document.readyState === "complete") start();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", start);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 700px)"
            srcSet={mobilePoster.srcSet}
            sizes="100vw"
          />
          <img {...desktopPoster} alt="" />
        </picture>
        <video
          ref={videoRef}
          className={ready ? "is-ready" : ""}
          width={1600}
          height={900}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onPlaying={() => {
            setReady(true);
          }}
          onError={() => {
            setReady(false);
          }}
        >
          <source
            src="/videos/garden-portrait-loop.mp4"
            type="video/mp4"
            media="(max-width: 700px)"
          />
          <source src="/videos/garden-path-loop.mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}
