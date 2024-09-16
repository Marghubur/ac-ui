import { Route } from "@angular/router";
import { Login } from "../../providers/constants";

export const Home_Routes: Route[] = [
  { path: "", loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)},
  { path: Login, loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)},
];
