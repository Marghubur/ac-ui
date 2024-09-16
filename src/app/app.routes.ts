import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component';
import { AdminBaseRoute } from '../providers/constants';
import { LoginComponent } from './home/login/login.component';

export const routes: Routes = [
  { path: "", component: LoginComponent, loadChildren: () => import('./home/home.route').then(c => c.Home_Routes)},
  {
    matcher: customMatcher(AdminBaseRoute),
    path: "",
    component: LayoutComponent,
    loadChildren: () => import("./admin/admin.route").then(c => c.Admin_Route)
  }
];


function customMatcher(name: string) {
  return (url) => {
    if (url[0].path.split(/\/(.*)/s)[0] == name) {
      return {
        consumed: url,
      };
    }
    return null;
  };
}
