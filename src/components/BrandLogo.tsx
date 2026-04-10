import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo = ({ className, size = 32 }: BrandLogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center shrink-0", className)} 
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main geometric prism shape */}
        <path
          d="M50 15L85 45L50 85L15 45L50 15Z"
          fill="url(#logo-grad)"
          fillOpacity="0.1"
          stroke="url(#logo-grad)"
          strokeWidth="2"
        />
        <path
          d="M50 15L70 45L50 75L30 45L50 15Z"
          fill="url(#logo-grad)"
          fillOpacity="0.8"
          filter="url(#glow)"
        />
        <path
          d="M50 35L60 45L50 55L40 45L50 35Z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
};
