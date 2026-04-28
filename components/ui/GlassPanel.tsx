import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
}

export function GlassPanel({
  children,
  className,
  innerClassName,
  ...props
}: PropsWithChildren<GlassPanelProps>) {
  return (
    <div className={cn("glass-panel noise-surface rounded-[28px]", className)} {...props}>
      <div className={cn("relative z-[1]", innerClassName)}>{children}</div>
    </div>
  );
}
