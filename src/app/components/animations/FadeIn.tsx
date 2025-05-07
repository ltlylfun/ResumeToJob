"use client";
import { useEffect, useRef, useState } from "react";
import { cx } from "lib/cx";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // 毫秒
  duration?: number; // 毫秒
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number; // 像素
  once?: boolean;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 500,
  className = "",
  direction = "up",
  distance = 20,
  once = true,
}: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        if (once && domRef.current) {
          observer.unobserve(domRef.current);
        }
      } else if (!once) {
        setIsVisible(false);
      }
    });
    
    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [once]);

  // 基于方向计算初始位置
  let transform = "translate(0, 0)";
  if (direction === "up") transform = `translateY(${distance}px)`;
  if (direction === "down") transform = `translateY(-${distance}px)`;
  if (direction === "left") transform = `translateX(${distance}px)`;
  if (direction === "right") transform = `translateX(-${distance}px)`;

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0, 0)" : transform,
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div 
      ref={domRef} 
      className={cx("transition-all", className)}
      style={animationStyle}
    >
      {children}
    </div>
  );
};