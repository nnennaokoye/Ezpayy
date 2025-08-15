'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

export default function InteractivePaymentCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState({ transform: 'rotateX(0deg) rotateY(0deg) scale(1)' });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)` });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: 'rotateX(0deg) rotateY(0deg) scale(1)' });
  };

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <div
        ref={ref}
        className="relative w-[320px] md:w-[380px] lg:w-[420px] h-[280px] md:h-[320px] lg:h-[360px] rounded-3xl p-4 bg-white/70 dark:bg-black/30 border border-white/40 dark:border-white/10 shadow-2xl backdrop-blur float-animation"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style as any}
      >
        {/* Shine */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -inset-1 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 h-full w-1/3 animate-[shine_2s_ease-in-out_infinite]" />
        </div>

        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image src="/payment.svg" alt="Payment" width={420} height={360} className="w-4/5 h-4/5 object-contain" />
        </div>
      </div>

      {/* Orbiting dots */}
      <div className="absolute -top-3 -right-3 w-3 h-3 rounded-full bg-primary animate-[orbit_6s_linear_infinite]" />
      <div className="absolute -bottom-3 -left-3 w-2.5 h-2.5 rounded-full bg-accent animate-[orbit_8s_linear_infinite]" />
    </div>
  );
}


