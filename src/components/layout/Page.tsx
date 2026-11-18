import React from "react";

/** The frame of every screen: same width, same padding, same gap between blocks. */
export const Page: React.FC<{ title?: string; intro?: string; narrow?: boolean; children: React.ReactNode }> = ({ title, intro, narrow, children }) => (
  <div className={`w-full mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>
    {(title || intro) && (
      <header>
        {title && <h1 className="text-lg font-bold text-white">{title}</h1>}
        {intro && <p className="text-xs text-gray-400 mt-1 max-w-4xl">{intro}</p>}
      </header>
    )}
    {children}
  </div>
);
