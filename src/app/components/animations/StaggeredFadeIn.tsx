"use client";
import { Children } from "react";
import { FadeIn } from "./FadeIn";

interface StaggeredFadeInProps {
  children: React.ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  duration?: number;
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
