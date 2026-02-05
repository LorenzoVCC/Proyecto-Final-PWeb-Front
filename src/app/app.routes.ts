import { Routes } from '@angular/router';

import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';

import { RestaurantListPage } from './pages/restaurant-list-page/restaurant-list-page';
import { RestaurantPage } from './pages/restaurant-page/restaurant-page';

import { ProductPage } from './pages/product-page/product-page';
import { NewProductPage } from './pages/new-product-page/new-product-page';

import { ClientLayout } from './layouts/client-layout/client-layout';
import { NewCategoryPage } from './pages/new-category-page/new-category-page';

import { authGuard } from './guards/auth-guard';
import { ownerGuard } from './guards/owner-guard';
import { publicGuard } from './guards/public-guard';

export const routes: Routes = [
  {
    path: "",
    component: ClientLayout,
    children: [
      { path: "", component: RestaurantListPage },
      { path: "restaurant-page/:id", component: RestaurantPage },
      { path: "product-page/:id", component: ProductPage },
    ],
  },
  {
    path: "login",
    component: LoginPage,
    canActivate: [publicGuard]
  },
  {
    path: "register",
    component: RegisterPage,
    canActivate: [publicGuard]
  },

  {
    path: "",
    component: ClientLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: "edit-restaurant/:restaurantId",
        component: RegisterPage,
        canActivate: [ownerGuard]
      },
      {
        path: "create-category/:restaurantId", 
        component: NewCategoryPage,
        canActivate: [ownerGuard]
      },
      { path: 'edit-category/:restaurantId/:categoryId', 
        component: NewCategoryPage,
        canActivate: [ownerGuard] 
      },
      {
        path: "new-product-page/:restaurantId/:categoryId",
        component: NewProductPage,
        canActivate: [ownerGuard],
      },
      {
        path: "edit-product-page/:restaurantId/:categoryId/:productId",
        component: NewProductPage,
        canActivate: [ownerGuard],
      },
      {
        path: "product-page/:id",
        component: ProductPage,
        canActivate: [ownerGuard],        
      },
    ],
  },

  { path: "**", redirectTo: "" },
];
