export interface ProductImage {
  url: string;
  is_main?: boolean;
}

export interface ProductRelation {
  name?: string;
}

export interface ProductVariant {
  id?: string;
  size?: string;
  color?: string;
  stock_quantity?: number | null;
  stock?: number | null;
  quantity?: number | null;
  price_override?: number | string | null;
}

export interface ProductData {
  id: string | number;
  slug: string;
  name: string;
  price: number | string;
  discount_percentage?: number | null;
  description?: string | null;
  image?: string;
  image_url?: string;
  brand?: string;
  category?: string;
  product_images?: ProductImage[];
  categories?: ProductRelation;
  brands?: ProductRelation;
  created_at?: string;
  product_variants?: ProductVariant[];
  [key: string]: unknown;
}
