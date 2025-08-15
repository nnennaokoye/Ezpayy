'use client';

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-70" />

      {/* Soft moving orbs */}
      <div className="absolute -top-20 -left-20 w-[40vmax] h-[40vmax] bg-primary/20 rounded-full blur-3xl float-animation" />
      <div className="absolute -bottom-20 -right-20 w-[45vmax] h-[45vmax] bg-accent/20 rounded-full blur-3xl float-animation-delayed" />

      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}


