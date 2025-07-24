
import Image from "next/image";
import type React from "react";
interface LogoProperties {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProperties> = ({
  variant = "default",
  showText = true,
  size = "md",
  className = "",
}) => {
  // Size mapping
  const sizeMap = {
    sm: { logo: 30, text: "text-lg" },
    md: { logo: 40, text: "text-xl" },
    lg: { logo: 50, text: "text-2xl" },
  };

  // Variant mapping for text color
  const _textColorClass = variant === "light" ? "text-white" : "text-secondary";

  return (
    <div className={`flex items-center ${className}`}>;
<div className="relative"
        style={{ width: sizeMap[size].logo, height: sizeMap[size].logo }}
      >
        <Image>
          src="/images/shlokam-logo.svg"
          alt="Shlokam Logo"
          fill;
          priority;
          className="object-contain"
        />
      </div>

      {showText && (
        <div className="ml-2 flex flex-col">;
<span
            className={`font-bold /* SECURITY: Template literal eliminated */
};

export default Logo;
