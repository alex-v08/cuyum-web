export type MaterialType = 'Melamina' | 'MDF' | 'Folio' | 'Vidrio';

export type CategorySlug = 'mostradores' | 'exhibidores' | 'vitrinas' | 'estanterias' | 'gondolas' | 'mesas';

export interface Variant {
  id: string;
  material: MaterialType;
  color: string;
  colorHex: string;
  priceModifier: number;
  images: string[];
  inStock: boolean;
  sku: string;
}

export interface ProductDimensions {
  width: string;
  height: string;
  depth: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  basePrice: number;
  priceLabel: string;
  variants: Variant[];
  featured: boolean;
  dimensions: ProductDimensions;
  weightKg: number;
  leadTimeDays: number;
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  productName: string;
  variantLabel: string;
  price: number;
  imageUrl: string;
}

export interface SiteConfig {
  businessName: string;
  whatsappNumber: string;
  whatsappDisplayNumber: string;
  address: string;
  instagramHandle: string;
  email: string;
  siteUrl: string;
  tagline: string;
}

export interface FilterState {
  categories: string[];
  materials: string[];
  searchQuery: string;
}

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';
