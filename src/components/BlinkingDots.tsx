"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  hasCrossFlare: boolean;
}

export function BlinkingDots() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const starColors = [
      "rgba(255, 255, 255, ",   // Pure Diamond White
      "rgba(165, 243, 252, ",   // Starlight Cyan
      "rgba(224, 231, 255, ",   // Cosmic Lavender
      "rgba(253, 230, 138, ",   // Nebula Amber
    ];

    function initStarfield() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx?.scale(dpr, dpr);

      // Density of stars based on screen area
      const count = Math.floor((width * height) / 3800);
      stars = [];

      for (let i = 0; i < count; i++) {
        const randSize = Math.random();
        let size = 1.0;
        let hasCrossFlare = false;

        if (randSize > 0.96) {
          size = 2.6;
          hasCrossFlare = true;
        } else if (randSize > 0.82) {
          size = 1.8;
        } else if (randSize > 0.4) {
          size = 1.2;
        } else {
          size = 0.8;
        }

        const colorPrefix = starColors[Math.floor(Math.random() * starColors.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseOpacity: 0.15 + Math.random() * 0.4,
          twinkleSpeed: 0.8 + Math.random() * 2.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: colorPrefix,
          hasCrossFlare,
        });
      }
    }

    initStarfield();
    window.addEventListener("resize", initStarfield);

    let time = 0;

    function render() {
      if (!ctx || !canvas) return;
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Sinusoidal twinkling + occasional bright sparkle pulse
        const pulse = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const sparkle = Math.pow(Math.max(0, pulse), 3);
        const opacity = Math.min(1.0, Math.max(0.05, star.baseOpacity + sparkle * 0.55));

        ctx.save();
        ctx.translate(star.x, star.y);

        // Draw main star dot
        ctx.beginPath();
        ctx.arc(0, 0, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${opacity.toFixed(3)})`;

        if (opacity > 0.6) {
          ctx.shadowColor = `${star.color}0.9)`;
          ctx.shadowBlur = star.size * 3;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();

        // Draw 4-point cross flare for bright major stars
        if (star.hasCrossFlare && opacity > 0.4) {
          const flareLen = star.size * (2.5 + sparkle * 2.0);
          const flareOpacity = opacity * 0.7;

          ctx.strokeStyle = `${star.color}${flareOpacity.toFixed(3)})`;
          ctx.lineWidth = 0.8;

          ctx.beginPath();
          // Horizontal line
          ctx.moveTo(-flareLen, 0);
          ctx.lineTo(flareLen, 0);
          // Vertical line
          ctx.moveTo(0, -flareLen);
          ctx.lineTo(0, flareLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", initStarfield);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
      aria-hidden="true"
    />
  );
}
