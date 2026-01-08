export interface RestaurantLoginDTO {
  email: string;
  password: string;
}

export interface RestaurantOwnerDTO {
    id: number;
    name: string;
    email: string;
    description?: string;
    imageUrl?: string;
    bgImage?: string;
    address: string;
    createdAt: string;
    slug: string;
    isActive: boolean;
}

export interface RestaurantForReadDTO {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    bgImage?: string;
    address: string;
    slug: string;
}

export interface RestaurantForCreateDTO {
  name: string;
  email: string;
  password: string;
  description?: string;
  imageUrl?: string;
  bgImage?: string;
  address: string;
  slug: string;
}

export interface RestaurantForUpdateDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
  bgImage?: string;
  address?: string;
  slug?: string;
}
