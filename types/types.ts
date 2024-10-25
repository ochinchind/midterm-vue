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