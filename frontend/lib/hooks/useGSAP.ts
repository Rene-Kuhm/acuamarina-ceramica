"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook for GSAP animations
 * Handles cleanup automatically
 */
export function useGSAP(
  callback: (context: gsap.Context) => void | (() => void),
  dependencies: any[] = []
) {
  const contextRef = useRef<gsap.Context>();

  useLayoutEffect(() => {
    contextRef.current = gsap.context(callback);

    return () => {
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollTrigger(
  trigger: string | HTMLElement,
  animation: gsap.TweenVars,
  scrollTriggerConfig?: ScrollTrigger.Vars
) {
  useGSAP(() => {
    gsap.to(trigger, {
      ...animation,
      scrollTrigger: {
        trigger,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...scrollTriggerConfig,
      },
    });
  }, [trigger]);
}
