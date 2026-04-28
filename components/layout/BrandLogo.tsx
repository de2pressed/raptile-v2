"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const sizeMap = {
  sm: {
    className: "h-8 md:h-9",
    width: 168,
    height: 56,
    sizes: "(max-width: 767px) 140px, 168px",
  },
  md: {
    className: "h-10 md:h-11",
    width: 216,
    height: 72,
    sizes: "(max-width: 767px) 180px, 216px",
  },
  lg: {
    className: "h-12 md:h-14",
    width: 272,
    height: 88,
    sizes: "(max-width: 767px) 220px, 272px",
  },
} as const;

export function BrandLogo({
  href = "/",
  className,
  imageClassName,
  fallbackClassName,
  size = "md",
  priority = false,
}: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const spec = sizeMap[size];

  const content = imageFailed ? (
    <span
      className={cn(
        "font-display font-bold uppercase tracking-[-0.05em] text-[color:var(--text)]",
        size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-lg" : "text-2xl md:text-[1.7rem]",
        fallbackClassName,
      )}
    >
      Raptile Studio
    </span>
  ) : (
    <Image
      alt="Raptile Studio"
      className={cn("h-auto w-auto object-contain", spec.className, imageClassName)}
      height={spec.height}
      onError={() => setImageFailed(true)}
      priority={priority}
      sizes={spec.sizes}
      src="/logo/logo.png"
      width={spec.width}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{content}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {content}
    </Link>
  );
}
