import { ApplicationStorage } from "./../../providers/ApplicationStorage";
import { CoreHttpService } from "../../providers/AjaxServices/core-http.service";
import { CommonService, Toast, UserDetail } from "./../../providers/common-service/common.service";
import { AccessTokenExpiredOn, Login } from "./../../providers/constants";
import { Component, OnInit, Output, EventEmitter, DoCheck } from "@angular/core";
import { iNavigation } from "../../providers/iNavigation";
import { JwtService, ResponseModel } from "../../auth/jwtService";
import { UserService } from "../../providers/userService";
import { RouterLink } from "@angular/router";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  imports: [RouterLink, CommonModule, NgOptimizedImage, NgbDropdownModule]
})
export class NavbarComponent implements OnInit, DoCheck {
  public sidebarOpened = false;
  public sizeOptions: Array<number> = [1,2, 3, 4, 5, 6, 7, 8, 9, 10];
  User: string;
  NotificationBadge: number = 0;
  InformationBadge: number = 0;
  NotificationDetail: Array<PopOverDetail> = [];
  InformationDetail: Array<PopOverDetail> = [];
  IsLoggedIn: boolean = false;
  PageName: string = "";
  Messages: Array<string> = [];
  userDetail: UserDetail = new UserDetail();
  Menu: Array<any> = [];
  TineMenu: boolean = false;
  isAdmin: boolean = true;
  root: any = null;
  isLoading: boolean = false;
  logo: string = "";
  @Output() authentication = new EventEmitter();
  selectedColor: string = "#ffffff";
  currentStyle: any = null;

  toggleOffcanvas() {
    let $doc: any = document;
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      $doc.querySelector(".sidebar-offcanvas").classList.add("active");
    } else {
      $doc.querySelector(".sidebar-offcanvas").classList.remove("active");
    }
  }

  constructor(
    private nav: iNavigation,
    private commonService: CommonService,
    private http: CoreHttpService,
    private local: ApplicationStorage,
    private tokenHelper: JwtService,
    private user: UserService
  ) {
    this.root = document.body;
    this.commonService.isLoading.subscribe(res => {
      this.isLoading = res;
    })
  }

  ngDoCheck(): void {
    let data = this.local.findRecord("UserDetail");
    let company = this.local.findRecord("Companies");
    this.currentStyle = this.local.getMenuStyle();
    if (this.currentStyle) {
      this.selectedColor = this.currentStyle.NavbarColor;
    }
    if(data) {
      if (data.UserTypeId == 1)
        this.isAdmin = true;
      else
        this.isAdmin = false;

        if (company) {
          this.logo = `${this.http.GetImageBasePath()}${company[0].LogoPath}`;
        }
    } else {
      this.GoToLoginPage();
    }


  }

  ngOnInit() {
    this.IsLoggedIn = false;
    let expiredOn = this.local.getByKey(AccessTokenExpiredOn);
    this.userDetail = this.user.getInstance() as UserDetail;

  }

  landLoginPage() {
    this.nav.navigate(Login, null);
  }

  CleanUpDetail() {

  }

  resetPassword() {

  }

  mangeAccount() {

  }

  LogoutUser() {
    this.nav.navigateWithoutArgs(Login);
    Toast("Log out successfully");
  }

  NavigatetoHome() {
    this.nav.navigate("", null);
  }

  GoToLoginPage() {
    this.nav.navigate(Login, null);
  }

  AutoDemo() {
    this.nav.navigate("/", null);
  }

  toggleMenu() {
    let $e = document.getElementById("page-menu");
    if($e && !this.TineMenu) {
      $e.classList.add("d-block");
    } else {
      $e.classList.remove("d-block");
    }
    this.TineMenu = !this.TineMenu;
  }

  balanceZooming(e: any) {
    let value = Number(e.target.value);
    let size = this.commonService.GetDefaultFontSize();
    size += value * 0.01;
    this.root.setAttribute("style", `font-size: ${size}vw !important`);
    // this.commonService.SetDefaultFontSize(size);
  }

  undozooming() {
    let size = 0.80;
    this.root.setAttribute("style", `font-size: ${size}vw !important`);
    this.commonService.SetDefaultFontSize(size);
  }

  changeColor(e: any) {
    this.selectedColor = e.target.value;
    this.http.post("Settings/LayoutConfigurationSetting", {
      IsMenuExpanded: this.currentStyle == null ? true : this.currentStyle.IsMenuExpanded,
      NavbarColor: this.selectedColor
    }).then((response: ResponseModel) => {
      if(response.ResponseBody) {
        Toast("User layout configuration save.");
        this.local.updateLayoutConfig(response.ResponseBody);
      }
    });
  }
}

interface PopOverDetail {
  imgName: string;
  name: string;
  time: string;
  message: string;
}
