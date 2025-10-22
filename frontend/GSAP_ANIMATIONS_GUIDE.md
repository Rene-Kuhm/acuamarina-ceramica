# Sistema de Animaciones GSAP - Aguamarina Mosaicos

## Instalación Completada

Se han instalado las siguientes dependencias:
- gsap
- @gsap/react  
- lenis (smooth scrolling)
- split-type (text animations)
- gsap-trial (plugins premium)

## Componentes Creados

### 1. SmoothScroll
**Ubicación:** `components/animations/SmoothScroll.tsx`

Implementa scroll suave con Lenis integrado con GSAP ScrollTrigger.

**Uso:**
```tsx
import { SmoothScroll } from "@/components/animations/SmoothScroll";

<SmoothScroll>
  {children}
</SmoothScroll>
```

### 2. ScrollReveal
**Ubicación:** `components/animations/ScrollReveal.tsx`

Componente para animar elementos al entrar en el viewport.

**Props:**
- `animation`: "fade" | "slideUp" | "slideRight" | "slideLeft" | "scale" | "clip"
- `delay`: number (segundos)
- `duration`: number (segundos)
- `ease`: string (ej: "power3.out")
- `once`: boolean (animar solo una vez)

**Uso:**
```tsx
<ScrollReveal animation="slideUp" delay={0.2} duration={1}>
  <div>Contenido que se anima</div>
</ScrollReveal>
```

### 3. CustomCursor
**Ubicación:** `components/animations/CustomCursor.tsx`

Cursor personalizado con efectos magnéticos en elementos interactivos.

**Uso:**
Ya integrado en layout.tsx, no requiere configuración adicional.

### 4. HeroGSAP
**Ubicación:** `components/home/HeroGSAP.tsx`

Hero animado con:
- Split text animation (letra por letra)
- Parallax scroll
- Fade out al hacer scroll
- Rotating background pattern

### 5. ProductCardGSAP
**Ubicación:** `components/productos/ProductCardGSAP.tsx`

Tarjeta de producto con:
- Scroll reveal (aparece al hacer scroll)
- Image zoom al hover
- Lift effect al hover
- Click feedback animation

**Props:**
- `product`: Producto
- `featured`: boolean
- `index`: number (para stagger effect)

**Uso:**
```tsx
{products.map((product, index) => (
  <ProductCardGSAP
    key={product.id}
    product={product}
    index={index}
  />
))}
```

## Hooks Personalizados

### useGSAP
**Ubicación:** `lib/hooks/useGSAP.ts`

Hook personalizado para manejar animaciones GSAP con cleanup automático.

**Uso:**
```tsx
import { useGSAP } from "@/lib/hooks/useGSAP";

function MyComponent() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".element", {
      opacity: 0,
      y: 50,
      duration: 1,
    });
  }, []);

  return <div ref={containerRef}>...</div>;
}
```

## Ejemplos de Uso

### Animación Simple
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function AnimatedBox() {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.from(boxRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return <div ref={boxRef}>Animated Content</div>;
}
```

### Scroll Trigger
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollTriggeredElement() {
  const elementRef = useRef(null);

  useEffect(() => {
    gsap.from(elementRef.current, {
      opacity: 0,
      y: 100,
      duration: 1,
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return <div ref={elementRef}>Content</div>;
}
```

### Stagger Animation
```tsx
<div className="grid">
  {items.map((item, index) => (
    <ScrollReveal
      key={item.id}
      animation="slideUp"
      delay={index * 0.1}
    >
      <Card>{item.content}</Card>
    </ScrollReveal>
  ))}
</div>
```

### Parallax Effect
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.to(sectionRef.current, {
      y: -100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return <div ref={sectionRef}>Parallax Content</div>;
}
```

## Tipos de Animaciones

### Easings
- `power1.out` - Suave
- `power2.out` - Moderado
- `power3.out` - Fuerte  
- `power4.out` - Muy fuerte
- `back.out(1.7)` - Con rebote
- `elastic.out(1, 0.3)` - Elástico

### Propiedades Animables
- `opacity`: 0 a 1
- `x`, `y`, `z`: Translación
- `scale`: Escala
- `rotation`: Rotación (grados)
- `skewX`, `skewY`: Sesgo
- `backgroundColor`: Color de fondo
- `color`: Color de texto

## Mejores Prácticas

1. **Usar useGSAP hook** para cleanup automático
2. **Registrar plugins** una sola vez
3. **Usar ScrollTrigger.refresh()** después de cambios en el DOM
4. **Preferir transforms sobre top/left** para mejor performance
5. **Usar will-change: transform** para animaciones complejas
6. **Limitar animaciones en mobile** para mejor performance

## Performance Tips

```tsx
// ✅ Bueno - Usa transforms
gsap.to(element, { x: 100, y: 50 });

// ❌ Malo - Usa layout properties
gsap.to(element, { left: 100, top: 50 });

// ✅ Bueno - Batch similar elements
gsap.from(".cards", {
  opacity: 0,
  y: 50,
  stagger: 0.1,
});

// ✅ Bueno - Kill animations on cleanup
useEffect(() => {
  const tl = gsap.timeline();
  return () => tl.kill();
}, []);
```

## Debugging

```tsx
// Ver todos los ScrollTriggers activos
ScrollTrigger.getAll().forEach(st => console.log(st));

// Refrescar todos los ScrollTriggers
ScrollTrigger.refresh();

// Ver markers (solo desarrollo)
ScrollTrigger.create({
  trigger: element,
  markers: true, // Muestra líneas de debug
});
```

## Recursos

- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Lenis](https://github.com/studio-freight/lenis)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)

---

**Versión:** 1.0.0
**Última actualización:** Octubre 2024
