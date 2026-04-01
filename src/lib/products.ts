import { products } from '@/data/products';
import type { Product, CategorySlug, FilterState, SortOption } from '@/types/product.types';

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, limit);
}

export function filterProducts(
  productList: Product[],
  filters: FilterState
): Product[] {
  return productList.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    if (filters.materials.length > 0) {
      const productMaterials = product.variants.map((v) => v.material);
      const hasMatchingMaterial = filters.materials.some((m) =>
        productMaterials.includes(m as Product['variants'][0]['material'])
      );
      if (!hasMatchingMaterial) return false;
    }
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });
}

export function sortProducts(productList: Product[], sort: SortOption): Product[] {
  const sorted = [...productList];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case 'price_desc':
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'relevance':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
