import React from "react";
import clsx from "clsx";

const Button = ({ variant = "default", className, children, ...props }) => {
  const baseStyles =
    "inline-flex items-center px-4 py-2 border rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variantStyles = {
    default: "bg-green-600 text-white border-transparent hover:bg-green-700",
    ghost:
      "bg-transparent text-black-600 border border-black hover:bg-green-50",
    link: "bg-transparent text-green-600 border-transparent hover:underline",
    black: "bg-black text-white border-transparent hover:bg-gray-800",
    blackSolid:
      "bg-black text-white border-white hover:bg-white hover:text-black",
    gray: " border-gray-400 hover:text-gray-700 hover:bg-gray-300", // New variant
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
