import { Route } from "@angular/router";
import { ChangePassword, DailyTransaction, Dashboard, InitialInvestment, ManageUser, MasterData, Roles, User, UserInvestment } from "../../providers/constants";

export const Admin_Route: Route[] = [
  { path: "",  loadComponent: () => import('../admin/home/home.component').then(c => c.HomeComponent) },
  { path: Dashboard, loadComponent: () => import('../admin/home/home.component').then(c => c.HomeComponent) },
  { path: InitialInvestment, loadComponent: () => import('../admin/initial-investment/initial-investment.component').then(c => c.InitialInvestmentComponent) },
  { path: MasterData , loadComponent: () => import("../admin/master-data/master-data.component").then(c => c.MasterDataComponent)},
  { path: User, loadComponent: () => import("../admin/user/user.component").then(c => c.UserComponent)},
  { path: ManageUser, loadComponent: () => import("../admin/manage-user/manage-user.component").then(c => c.ManageUserComponent)},
  { path: UserInvestment, loadComponent: () => import("../admin/user-investment/user-investment.component").then(c => c.UserInvestmentComponent)},
  { path: Roles, loadComponent: () => import("../admin/role/role.component").then(c => c.RoleComponent)},
  { path: DailyTransaction, loadComponent: () => import("../admin/daily-transaction/daily-transaction.component").then(c => c.DailyTransactionComponent)},
  { path: ChangePassword, loadComponent: () => import("../admin/change-password/change-password.component").then(c => c.ChangePasswordComponent)},
];
