import React from "react";

function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary",
  ...rest
}) {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    success: "bg-green-500 hover:bg-green-600",
    info: "bg-indigo-500 hover:bg-indigo-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-white font-semibold focus:outline-none ${variantClasses[variant]} ${className}`}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
