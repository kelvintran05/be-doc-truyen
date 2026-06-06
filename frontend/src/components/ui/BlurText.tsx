"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  stepDuration?: number;
}

export function BlurText({
  text,
  className = "",
  delay = 100,
  animateBy = "words",
  direction = "bottom",
  stepDuration = 0.35,
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  return (
    <div ref={ref} className={className}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "bottom" ? 50 : -50,
          }}
          animate={
            isVisible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [direction === "bottom" ? 50 : -50, -5, 0],
                }
              : {}
          }
          transition={{
            duration: stepDuration,
            delay: index * (delay / 1000),
            ease: "easeOut",
          }}
        >
          {item}
          {animateBy === "words" && index < items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}
