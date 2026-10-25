import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3;
}

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  ...rest
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${delayClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
