import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export const BrandLogo = ({ className, size = 32, priority = false }: BrandLogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center shrink-0", className)} 
      style={{ width: size, height: size }}
    >
      <Image
        src="/og-image.png"
        alt="ChanceScribe AI Logo"
        width={size}
        height={size}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
};
