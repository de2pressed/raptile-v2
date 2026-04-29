"use client";

import type { ReactNode, SVGAttributes } from "react";

type IconProps = SVGAttributes<SVGSVGElement>;

function BaseIcon({ children, className, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 7.5h14" />
      <path d="M5 12h14" />
      <path d="M5 16.5h14" />
    </BaseIcon>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4.5 5h1.8l1.8 9.2h9.4l1.6-6.2H8.5" />
      <path d="M8 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M16.2 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </BaseIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 9 6 6 6-6" />
    </BaseIcon>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m6 15 6-6 6 6" />
    </BaseIcon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </BaseIcon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </BaseIcon>
  );
}
