"use client";
import React, { useState } from "react";
import { cx } from "lib/cx";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number; // 悬停时的放大倍数
  hoverRotate?: boolean; // 是否启用3D旋转效果
  clickEffect?: boolean; // 是否启用点击效果
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

  // 检测设备类型
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 在移动设备上禁用复杂动画效果
    if (!hoverRotate || isMobileDevice) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // 鼠标相对于卡片的 X 坐标
    const y = e.clientY - rect.top; // 鼠标相对于卡片的 Y 坐标

    // 计算鼠标位置相对于卡片中心的偏移量
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 将偏移量映射到旋转角度范围 (-10度 到 10度)
    const rotateX = ((y - centerY) / centerY) * -5; // 上下移动影响 X 轴旋转
    const rotateY = ((x - centerX) / centerX) * 5; // 左右移动影响 Y 轴旋转

    setMousePosition({ x: rotateY, y: rotateX });
  };
  // 计算样式
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
        isHovering ? "shadow-lg" : "shadow"
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
