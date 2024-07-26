import React, { ReactNode } from 'react';

interface FooterProps {
  children: ReactNode;
}

export function FooterSection({ children }: FooterProps) {
  return (
    <div className="w-full w-[1200px] h-auto bg-white mx-auto flex">
      {children}
    </div>
  );
}

export default FooterSection;
