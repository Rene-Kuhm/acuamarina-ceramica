"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function HeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgShapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(titleRef.current?.querySelectorAll(".char") || [], {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.5)",
      }, "-=0.4")
      .from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5")
      .from(ctaRef.current?.querySelectorAll("button") || [], {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(2)",
      }, "-=0.3");

      gsap.to(bgShapeRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(containerRef.current, {
            y: self.progress * 150,
            opacity: 1 - self.progress * 0.5,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
    >
      <div
        ref={bgShapeRef}
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, #111 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl" />

      <div className="container-premium relative z-10 text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 border border-gray-200 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-black" />
          Bienvenido a Aguamarina Mosaicos
        </div>

        <h1
          ref={titleRef}
          className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
          style={{ perspective: "1000px" }}
        >
          <div className="mb-2">
            {splitText("Diseño que")}
          </div>
          <div className="text-gray-400">
            {splitText("transforma")}
          </div>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Descubre nuestra colección premium de mosaicos cerámicos.
          <br />
          Calidad excepcional para proyectos extraordinarios.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/productos">
            <button className="group relative px-8 py-4 bg-black text-white rounded-full font-medium overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Ver Catálogo Completo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>

          <Link href="/categorias">
            <button className="px-8 py-4 border-2 border-black bg-transparent text-black rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300">
              Explorar Categorías
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
