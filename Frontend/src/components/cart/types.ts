export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'software' | 'idea' | 'design' | 'algorithm';
  studentName: string;
  university: string;
  rating: number;
  downloadable: boolean;
  licenseType: 'personal' | 'commercial' | 'enterprise';
  tags: string[];
  image?: string;
  quantity: number;
}

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  category: 'software' | 'idea' | 'design' | 'algorithm';
  studentName: string;
}

export interface FeaturedProject {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'software' | 'idea' | 'design' | 'algorithm';
  studentName: string;
  university: string;
  rating: number;
  tags: string[];
  image?: string;
}
