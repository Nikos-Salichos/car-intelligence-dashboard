import React from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const BASE = "inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400";
const VARIANT: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-500 text-white",
  secondary: "bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100",
  ghost: "text-gray-300 hover:text-white hover:bg-gray-800",
  danger: "bg-red-700 hover:bg-red-600 text-white",
};
const SIZE: Record<Size, string> = { sm: "px-2.5 py-1 text-xs", md: "px-4 py-2 text-sm" };

const style = (variant: Variant, size: Size, extra?: string) => `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${extra ?? ""}`;

interface Common {
  variant?: Variant;
  size?: Size;
}

export const Button: React.FC<Common & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ variant = "primary", size = "md", className, type = "button", ...rest }) => (
  <button type={type} className={style(variant, size, className)} {...rest} />
);

/** A link that looks like a button: inside the app (`to`) or to another site (`href`, opens in a new tab). */
export const LinkButton: React.FC<Common & { to?: string; href?: string; newTab?: boolean; children: React.ReactNode; className?: string }> = ({ variant = "secondary", size = "sm", to, href, children, className, newTab }) =>
  to ? (
    <Link to={to} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={style(variant, size, className)}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={style(variant, size, className)}>
      {children}
    </a>
  );
