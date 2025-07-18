"use client";
import React, { useState } from "react";
import { cx } from "lib/cx";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: boolean;
  clickEffect?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  hoverScale = 1.03,
  hoverRotate = false,
  clickEffect = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverRotate || isMobileDevice) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setMousePosition({ x: rotateY, y: rotateX });
  };

  const style: React.CSSProperties = {
    transform:
      isHovering && !isMobileDevice
        ? `scale(${hoverScale}) ${
            hoverRotate && !isMobileDevice
              ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
              : ""
          } ${isPressed && clickEffect ? "scale(0.98)" : ""}`
        : "scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)",
    transition: isHovering ? "transform 0.1s ease" : "transform 0.3s ease",
  };

  return (
    <div
      className={cx(
        "overflow-hidden rounded-lg transition-all duration-300",
        className,
        isHovering ? "shadow-lg" : "shadow",
      )}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => clickEffect && setIsPressed(true)}
      onMouseUp={() => clickEffect && setIsPressed(false)}
    >
      {children}
    </div>
  );
};
