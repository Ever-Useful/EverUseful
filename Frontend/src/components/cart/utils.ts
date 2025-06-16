export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'software':
      return '💻';
    case 'idea':
      return '💡';
    case 'design':
      return '🎨';
    case 'algorithm':
      return '⚡';
    default:
      return '📁';
  }
};

export const getLicenseColor = (license: string) => {
  switch (license) {
    case 'personal':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'commercial':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'enterprise':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};