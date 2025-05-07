"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logoSrc from "public/logo-500.png";

interface LogoProps {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export const LogoFallingAnimation = ({
  logoCount = 15,
  minSize = 20,
  maxSize = 50,
  minSpeed = 1,
  maxSpeed = 3,
  minOpacity = 0.1,
  maxOpacity = 0.3,
}) => {
  const [logos, setLogos] = useState<LogoProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 初始化logo位置
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        const newLogos: LogoProps[] = [];
        for (let i = 0; i < logoCount; i++) {
          const size = Math.random() * (maxSize - minSize) + minSize;
          newLogos.push({
            x: Math.random() * width,
            y: Math.random() * height * 2 - height, // 有些在屏幕上方，有些在屏幕下方
            size,
            speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
            opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2, // 正或负值决定旋转方向
          });
        }
        setLogos(newLogos);
      }
    };

    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [logoCount, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity]);

  // 动画效果
  useEffect(() => {
    if (logos.length === 0 || !containerRef.current) return;

    const animate = () => {
      setLogos(prevLogos => 
        prevLogos.map(logo => {
          let newY = logo.y + logo.speed;
          let newX = logo.x + (Math.sin(newY / 50) * 0.5); // 让logo左右摆动
          let newRotation = logo.rotation + logo.rotationSpeed;
          
          // 当logo移出屏幕底部时，重新在屏幕上方生成
          if (newY > dimensions.height + logo.size) {
            newY = -logo.size;
            newX = Math.random() * dimensions.width;
          }
          
          return {
            ...logo,
            y: newY,
            x: newX,
            rotation: newRotation % 360
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [logos, dimensions]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {logos.map((logo, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${logo.x}px`,
            top: `${logo.y}px`,
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            opacity: logo.opacity,
            transform: `rotate(${logo.rotation}deg)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <Image
            src={logoSrc}
            alt=""
            fill
            sizes={`${logo.size}px`}
            style={{ objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
};