import { inject, Injectable } from '@angular/core';
import { Auth } from './auth-service';
import { ProductForCreateUpdateDTO, ProductForReadDTO } from '../interfaces/product-interface';
import { API_URL } from '../config/api';

@Injectable({ providedIn: 'root' })

export class ProductService {
  auth = inject(Auth);
  readonly URL_BASE = `${API_URL}/api/Product`;

  products: ProductForReadDTO[] = [];

  private mapProduct(p: any): ProductForReadDTO {
    return {
      id_Product: p.id_Product ?? p.Id_Product ?? p.idProduct ?? p.id,
      name: p.name ?? p.Name ?? '',
      description: p.description ?? p.Description ?? '',
      price: p.price ?? p.Price ?? 0,
      happyHour: p.happyHour ?? p.HappyHour ?? false,
      isFeatured: p.isFeatured ?? p.IsFeatured ?? false,
      discount: p.discount ?? p.Discount ?? 0,
      urlImage: p.urlImage ?? p.UrlImage ?? '',
      id_Category: p.id_Category ?? p.Id_Category ?? p.idCategory ?? 0,
    };
  }
  ///////////////////
  async getById(id: number) {
    const res = await fetch(`${this.URL_BASE}/${id}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    const data = await res.json();
    return this.mapProduct(data);
  }
  ///////////////////
  async getByCategoryId(categoryId: number) {
    const res = await fetch(`${this.URL_BASE}/by-category/${categoryId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });

    if (res.status === 401) {
      this.auth.logout();
      this.products = [];
      return [];
    }

    if (!res.ok) {
      this.deleteByCategoryId(categoryId);
      return [];
    }

    const data = await res.json();
    const list = data.map((p: any) => this.mapProduct(p));

    this.products = [
      ...this.products.filter(p => p.id_Category !== categoryId),
      ...list
    ];
    return list;
  }
  /////////////////////
  deleteByCategoryId(categoryId: number): void {
    this.products = this.products.filter(p => p.id_Category !== categoryId);
  }

  getCachedByCategoryId(categoryId: number) {
    return this.products.filter(p => p.id_Category === categoryId);
  }
  ///////////////////
  async createProduct(dto: ProductForCreateUpdateDTO) {
    const payload = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      discount: dto.discount,
      urlImage: dto.urlImage,
      id_Category: dto.id_Category,
    };

    const res = await fetch(this.URL_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    const rescreated = await res.json();
    const created = this.mapProduct(rescreated);

    this.products.push(created);
    return created;
  }
  ///////////////////
  async updateProduct(productId: number, dto: ProductForCreateUpdateDTO) {
    const payload: any = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      urlImage: dto.urlImage,
      id_Category: dto.id_Category,
    };

    const res = await fetch(`${this.URL_BASE}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    return await this.getById(productId);
  }


  /////////////////// 
  async deleteProduct(productId: number) {
    const res = await fetch(`${this.URL_BASE}/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return false;

    this.products = this.products.filter(p => p.id_Product !== productId);
    return true;
  }

  //Happy Hour
  async updateDiscount(productId: number, discount: number) {

    const res = await fetch(`${this.URL_BASE}/${productId}/discount`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify({ discount }),
    });

    if (res.status === 401) {
      this.auth.logout();
      return false;
    }

    if (!res.ok) return false;
    this.products = this.products.map(p =>
      p.id_Product === productId ? { ...p, discount } : p
    );
    return true;
  }

  async toggleHappyHour(productId: number) {

    const res = await fetch(`${this.URL_BASE}/${productId}/toggle-happyhour`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.auth.token,
      },
    });

    if (res.status === 401) {
      this.auth.logout();
      return false;
    }

    if (!res.ok) return false;

    this.products = this.products.map(p =>
      p.id_Product === productId
        ? { ...p, happyHour: !p.happyHour }
        : p
    );

    return true;
  }

  async toggleFeatured(productId: number) {

    const res = await fetch(`${this.URL_BASE}/${productId}/toggle-featured`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + this.auth.token,
      },
    });

    if (res.status === 401) {
      this.auth.logout();
      return false;
    }

    if (!res.ok) return false;

    this.products = this.products.map(p =>
      p.id_Product === productId
        ? { ...p, isFeatured: !p.isFeatured }
        : p
    );

    return true;
  }
}

