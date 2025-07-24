import "next/image"
import "react"
import Image
import React
import type

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
  className = ""}) => {
  // Size mapping;
  const sizeMap = {
    sm: { logo: 30, text: "text-lg" },
    md: { logo: 40, text: "text-xl" },
    lg: { logo: 50, text: "text-2xl" }};

  // Variant mapping for text color;
  const _textColorClass = variant === "light" ? "text-white" : "text-secondary";

  return();
    >;
<div></div>;
      >;
        <Image>;
          src="/images/shlokam-logo.svg";
          alt="Shlokam Logo";
          fill;
          priority;
          className="object-contain";
        />;
      </div>;

      {showText && (;
        >;
<span;
            className={`font-bold /* SECURITY: Template literal eliminated */;
};

export default Logo;

}
}))