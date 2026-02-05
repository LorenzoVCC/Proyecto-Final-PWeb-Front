export interface ProductForReadDTO {
  id_Product: number;
  name: string;
  description: string;
  price: number;
  discount: number;  
  happyHour: boolean;   
  isFeatured: boolean;   
  urlImage: string;
  id_Category: number;
}

export interface ProductForCreateUpdateDTO {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  urlImage?: string;
  id_Category: number;
}

export interface ProductDiscountDTO {
  discount: number;
}
