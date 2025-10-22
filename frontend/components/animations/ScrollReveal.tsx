"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade" | "slideUp" | "slideRight" | "slideLeft" | "scale" | "clip";
  delay?: number;
  duration?: number;
  ease?: string;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = "fade",
  delay = 0,
  duration = 1,
  ease = "power3.out",
  threshold = 0.2,
  once = true,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animations = {
      fade: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideUp: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0 },
      },
      slideRight: {
        from: { opacity: 0, x: -60 },
        to: { opacity: 1, x: 0 },
      },
      slideLeft: {
        from: { opacity: 0, x: 60 },
        to: { opacity: 1, x: 0 },
      },
      scale: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      clip: {
        from: { clipPath: "inset(0% 100% 0% 0%)" },
        to: { clipPath: "inset(0% 0% 0% 0%)" },
      },
    };

    const selectedAnimation = animations[animation];
    gsap.set(element, selectedAnimation.from);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      once: once,
      onEnter: () => {
        gsap.to(element, {
          ...selectedAnimation.to,
          duration,
          delay,
          ease,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [animation, delay, duration, ease, threshold, once]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
