import Image from 'next/image';

interface PaymentGraphicProps {
  className?: string;
  size?: number;
}

export default function PaymentGraphic({ className = '', size = 320 }: PaymentGraphicProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 blur-xl" />
      <div className="relative rounded-2xl p-4 bg-white/70 dark:bg-black/30 border border-white/30 dark:border-white/10 shadow-2xl backdrop-blur float-animation">
        <Image
          src="/payment.svg"
          alt="Payment Illustration"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}


