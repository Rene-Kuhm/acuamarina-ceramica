"use client";

import { useLayoutEffect, useRef } from "react";
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
  dependencies: React.DependencyList = []
) {
  const contextRef = useRef<gsap.Context | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref
  callbackRef.current = callback;

  useLayoutEffect(() => {
    contextRef.current = gsap.context(() => {
      if (callbackRef.current && contextRef.current) {
        callbackRef.current(contextRef.current);
      }
    });

    return () => {
      contextRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [trigger, animation, scrollTriggerConfig]);
}
