import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';



const routes: Routes = [
  {
    path: '',
    component : HomeComponent,
    children: [
      {
        path: 'permission',
        loadChildren : () => import('./../../components/user-management/permission/permission.module').then(p => p.PermissionModule)
      },
      {
        path: 'role',
        loadChildren : () => import('./../../components/user-management/role/role.module').then(p => p.RoleModule)
      },
      {
        path: 'menu',
        loadChildren : () => import('./../../components/user-management/menu/menu.module').then(p => p.MenuModule)
      },
      {
        path: 'user',
        loadChildren : () => import('./../../components/user-management/user/user.module').then(p => p.UserModule)
      },
      {
        path: 'section',
        loadChildren : () => import('./../../components/home-page-config/section/section.module').then(p => p.SectionModule)
      },
      {
        path: 'slider',
        loadChildren : () => import('./../../components/home-page-config/slider/slider.module').then(p => p.SliderModule)
      },
      {
        path: 'category',
        loadChildren : () => import('./../../components/product-management/category/category.module').then(p => p.CategoryModule)
      },
      {
        path: 'brand',
        loadChildren : () => import('./../../components/product-management/brand/brand.module').then(p => p.BrandModule)
      },
      {
        path: 'filter',
        loadChildren : () => import('./../../components/product-management/filter/filter.module').then(p => p.FilterModule)
      },
      {
        path: 'product',
        loadChildren : () => import('./../../components/product-management/product/product.module').then(p => p.ProductModule)
      },
      {
        path: 'approve-reviews',
        loadChildren : () => import('./../../components/product-management/reviews/reviews.module').then(p => p.ReviewsModule)
      },
      {
        path: 'orders',
        loadChildren : () => import('./../../components/order/order-details/order-details.module').then(p => p.OrderDetailsModule)
      },
      {
        path: 'sms-config',
        loadChildren : () => import('./../../components/product-management/sms-config/sms-config.module').then(p => p.SmsConfigModule)
      },
      {
        path: 'promotion',
        loadChildren : () => import('./../../components/product-management/promotion/promotion.module').then(p => p.PromotionModule)
      },
      {
        path: 'view-orders',
        loadChildren : () => import('./../../components/order/order-monitoring/order-monitoring.module').then(p => p.OrderMonitoringModule)
      },
      {
        path: 'order-report',
        loadChildren : () => import('./../../components/reports/order-report/order-report.module').then(p => p.OrderReportModule)
      }
    ]
  }
];

  @NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class HomeRoutingModule { }
