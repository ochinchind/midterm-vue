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