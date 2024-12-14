export interface Sneaker {
    id: number;
    name: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string|null;
    last_activity: Date|null;
    age: string|null;
    location: string|null;
    activated: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    rating: number;
    price: number;
    image_url: string;
    category_name: string|null;
  }

  export interface Category {
    id: number;
    name: string;
    slug: string;
  }

  export interface ProductDetail {
    id: number;
    name: string;
    description: string;
    rating: number;
    price: number;
    image_url: string;
    category_name: string|null;
    photos: Photo[];
    reviews: Review[];
    isInCart: boolean;
    isInFavorites: boolean;
  }

  export interface Review {
    id: number;
    text: string;
    rating: string;
    created_at: string;
    username: string;
    last_activity: string;
  }

  export interface Photo {
    photo: string;
  }

  export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    description: string;
    rating: number;
    category_name: string|null;
    photos: Photo[];
    reviews: Review[];
    isInCart: boolean;
  }