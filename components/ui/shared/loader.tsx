"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    wrapper: "h-4 w-4",
    hex: "h-2 w-4 mt-1",
    offsetX: "18px",
    offsetY: "14px",
    borderWidth: "8px",
    borderHeight: "4px",
  },
  md: {
    wrapper: "h-6 w-6",
    hex: "h-3 w-6 mt-1.5",
    offsetX: "28px",
    offsetY: "22px",
    borderWidth: "12px",
    borderHeight: "6px",
  },
  lg: {
    wrapper: "h-8 w-8",
    hex: "h-4 w-8 mt-2",
    offsetX: "36px",
    offsetY: "28px",
    borderWidth: "16px",
    borderHeight: "8px",
  },
};

const Loader = ({ size = "md" }: LoaderProps) => {
  const config = sizeConfig[size];

  return (
    <div className="relative">
      <div
        className={`
          relative ${config.wrapper}
          [&>div]:bg-foreground
          [&>div]:${config.hex}
          [&>div]:absolute
          [&>div]:animate-[honeycomb_2.1s_infinite_backwards]
          
          [&>div:after]:content-['']
          [&>div:before]:content-['']
          [&>div:after]:border-l-[${config.borderWidth}]
          [&>div:after]:border-r-[${config.borderWidth}]
          [&>div:before]:border-l-[${config.borderWidth}]
          [&>div:before]:border-r-[${config.borderWidth}]
          [&>div:after]:border-transparent
          [&>div:before]:border-transparent
          [&>div:after]:absolute
          [&>div:before]:absolute
          [&>div:after]:left-0
          [&>div:after]:right-0
          [&>div:before]:left-0
          [&>div:before]:right-0
          
          [&>div:after]:top-[-${config.borderHeight}]
          [&>div:after]:border-b-[${config.borderHeight}]
          [&>div:after]:border-b-foreground
          [&>div:before]:bottom-[-${config.borderHeight}]
          [&>div:before]:border-t-[${config.borderHeight}]
          [&>div:before]:border-t-foreground

          [&>div:nth-child(1)]:left-[-${config.offsetX}]
          [&>div:nth-child(1)]:top-0
          [&>div:nth-child(1)]:animate-[honeycomb_2.1s_0s_infinite_backwards]
          
          [&>div:nth-child(2)]:left-[-${parseInt(config.offsetX)/2}px]
          [&>div:nth-child(2)]:top-[${config.offsetY}]
          [&>div:nth-child(2)]:animate-[honeycomb_2.1s_0.1s_infinite_backwards]
          
          [&>div:nth-child(3)]:left-[${parseInt(config.offsetX)/2}px]
          [&>div:nth-child(3)]:top-[${config.offsetY}]
          [&>div:nth-child(3)]:animate-[honeycomb_2.1s_0.2s_infinite_backwards]
          
          [&>div:nth-child(4)]:left-[${config.offsetX}]
          [&>div:nth-child(4)]:top-0
          [&>div:nth-child(4)]:animate-[honeycomb_2.1s_0.3s_infinite_backwards]
          
          [&>div:nth-child(5)]:left-[${parseInt(config.offsetX)/2}px]
          [&>div:nth-child(5)]:top-[-${config.offsetY}]
          [&>div:nth-child(5)]:animate-[honeycomb_2.1s_0.4s_infinite_backwards]
          
          [&>div:nth-child(6)]:left-[-${parseInt(config.offsetX)/2}px]
          [&>div:nth-child(6)]:top-[-${config.offsetY}]
          [&>div:nth-child(6)]:animate-[honeycomb_2.1s_0.5s_infinite_backwards]
          
          [&>div:nth-child(7)]:left-0
          [&>div:nth-child(7)]:top-0
          [&>div:nth-child(7)]:animate-[honeycomb_2.1s_0.6s_infinite_backwards]
        `}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Loader;
