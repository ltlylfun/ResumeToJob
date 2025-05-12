"use client";
import { useState, useEffect, useRef } from "react";
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

  // 检测是否是移动设备，如果是则减少logo数量
  const isMobileDevice = () => {
    return window.innerWidth < 768;
  };
  // 初始化logo位置
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });

        // 移动设备上显示更少的logo
        const actualLogoCount = isMobileDevice()
          ? Math.max(6, Math.floor(logoCount / 2))
          : logoCount;
        // 移动设备上使用更小的尺寸
        const actualMaxSize = isMobileDevice()
          ? Math.max(30, maxSize * 0.7)
          : maxSize;

        const newLogos: LogoProps[] = [];
        for (let i = 0; i < actualLogoCount; i++) {
          const size = Math.random() * (actualMaxSize - minSize) + minSize;
          newLogos.push({
            x: Math.random() * width,
            y: Math.random() * height * 2 - height, // 有些在屏幕上方，有些在屏幕下方
            size,
            speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
            opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * (isMobileDevice() ? 1 : 2), // 移动设备上旋转更慢
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
      setLogos((prevLogos) =>
        prevLogos.map((logo) => {
          let newY = logo.y + logo.speed;
          let newX = logo.x + Math.sin(newY / 50) * 0.5; // 让logo左右摆动
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
            rotation: newRotation % 360,
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
      className="pointer-events-none absolute inset-0 overflow-hidden"
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
            transition: "transform 0.1s linear",
          }}
        >
          <img
            src={logoSrc.src}
            alt=""
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      ))}
    </div>
  );
};
