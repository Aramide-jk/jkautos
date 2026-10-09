"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function FadeImage({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      alt={alt}
      {...props}
      className={["imgFade", loaded ? "is-loaded" : "", className ?? ""].filter(Boolean).join(" ")}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}
