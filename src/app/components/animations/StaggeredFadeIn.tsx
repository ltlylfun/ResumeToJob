"use client";
import { Children, cloneElement, isValidElement } from "react";
import { FadeIn } from "./FadeIn";

interface StaggeredFadeInProps {
  children: React.ReactNode;
  staggerDelay?: number; // 每个元素之间的延迟（毫秒）
  baseDelay?: number; // 第一个元素的延迟（毫秒）
  duration?: number; // 每个元素的动画持续时间
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  childClassName?: string;
  as?: React.ElementType;
}

export const StaggeredFadeIn = ({
  children,
  staggerDelay = 100,
  baseDelay = 0,
  duration = 500,
  direction = "up",
  distance = 20,
  className = "",
  childClassName = "",
  as: Component = "div",
}: StaggeredFadeInProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <Component className={className}>
      {childrenArray.map((child, index) => {
        const delay = baseDelay + index * staggerDelay;
        
        return (
          <FadeIn
            key={index}
            delay={delay}
            duration={duration}
            direction={direction}
            distance={distance}
            className={childClassName}
          >
            {child}
          </FadeIn>
        );
      })}
    </Component>
  );
};