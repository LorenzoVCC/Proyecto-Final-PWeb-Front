export interface ProductForReadDTO {
  id_Product: number;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  urlImage?: string;
  id_Category: number;
}

export interface ProductForCreateDTO {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  urlImage?: string;
  id_Category: number;
}
