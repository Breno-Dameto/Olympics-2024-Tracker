import React, { ReactNode } from 'react';

interface HeroSectionProps {
  children: ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <div className="w-full w-[1200px] h-auto rounded-md bg-heroSectionBackground flex flex-col items-center justify-center mx-auto">
      {children}
    </div>
  );
}

export default HeroSection;
