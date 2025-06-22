import React from 'react';

interface InitialsAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
  className?: string;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ 
  firstName, 
  lastName, 
  size = 128, 
  className = "" 
}) => {
  // Get initials from first and last name
  const getInitials = (first: string, last: string) => {
    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500',
      'from-pink-500 to-rose-500',
      'from-yellow-500 to-orange-500',
      'from-emerald-500 to-teal-500',
      'from-violet-500 to-purple-500'
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initials = getInitials(firstName, lastName);
  const gradientClass = getColorFromName(firstName + lastName);
  const fontSize = Math.max(size * 0.4, 16); // Responsive font size

  if (!initials) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize }}>?</span>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize }}>{initials}</span>
    </div>
  );
};

export default InitialsAvatar; 