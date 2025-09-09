import React from 'react';

interface LoadingAnimationProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'custom';
  className?: string;
  src?: string;
  fullScreen?: boolean;
}

const sizeMap: Record<NonNullable<LoadingAnimationProps['size']>, string> = {
  xs: 'w-12 h-12',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  custom: 'w-[100px] h-[100px]',
};

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'custom',
  className = '',
  src = 'https://amogh-assets.s3.ap-south-1.amazonaws.com/content/loading+animation.mp4',
  fullScreen = false,
}) => {
  const containerClass = fullScreen 
    ? `flex items-center justify-center min-h-screen bg-black ${className}`
    : `flex items-center justify-center bg-black ${className}`;

  return (
    <div className={containerClass}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`${sizeMap[size]} object-contain`}
        style={{ backgroundColor: 'transparent' }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default LoadingAnimation;