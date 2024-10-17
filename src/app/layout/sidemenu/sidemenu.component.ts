import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ElementRef } from "@angular/core";
import * as bootstrap from 'bootstrap';
import packageJson from '../../../../package.json';
import { UserDetail, CommonService, ErrorToast, Toast } from "../../../providers/common-service/common.service";
import { iNavigation } from "../../../providers/iNavigation";
import { UserService } from "../../../providers/userService";
import { Dashboard, InitialInvestment, Login, MasterData, Roles, User} from "../../../providers/constants";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ApplicationStorage } from "../../../providers/ApplicationStorage";

@Component({
  standalone: true,
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  imports: [CommonModule, RouterLink]
})
export class SidemenuComponent implements OnInit, AfterViewChecked {
  public sidebarOpened = false;
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
  CatagoryPosition: number = 0;
  private MenuName: string = '';
  isAdmin: boolean = false;
  isLoading: boolean = false;
  isMinimize: boolean = false;
  isMenuExpanded: boolean = true;
  @Output() authentication = new EventEmitter();
  navbarColor: string = null;
  version: string = packageJson.version;
  tooltipInstance: bootstrap.Tooltip | null = null;
  currentPage: string = "";

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
    private local: ApplicationStorage,
    private user: UserService,
    private elementRef: ElementRef
  ) {
    this.commonService.isLoading.subscribe(res => {
      this.isLoading = res;
    });
    this.commonService.isMinimize.subscribe(res => {
      this.isMinimize = res;
    });

    this.currentPage = this.nav.getRouteList()[0].Key;
  }

  ngAfterViewChecked(): void {
    const element = this.elementRef.nativeElement;
    element.addEventListener('mouseenter', () => {
      this.tooltipInstance = new bootstrap.Tooltip(element, {
        trigger: 'manual'
      });
      this.tooltipInstance.show();
    });

    element.addEventListener('mouseleave', () => {
      if (this.tooltipInstance) {
        this.tooltipInstance.hide();
        this.tooltipInstance.dispose();
        this.tooltipInstance = null;
      }
    });
  }

  ngOnInit() {
    this.IsLoggedIn = false;
    this.isAdmin = true;
    this.userDetail = this.user.getInstance() as UserDetail;
    
    let menuItem = this.nav.getRouteList();
    this.MenuName = menuItem[0].Key;
    let Master = this.local.get(null);
    this.BuildMenu(Master["menu"]);
    
    // this.Menu = [{
    //   IsActive: true,
    //   ParentDetail: {
    //     Icon: "fa-brands fa-fort-awesome",
    //     Badge: null
    //   },
    //   Name: "Administration",
    //   Value: [
    //     {
    //       Link: Dashboard,
    //       Icon: "fa-solid fa-gauge-high",
    //       Catagory: "Dashboard"
    //     },
    //     {
    //       Link: User,
    //       Icon: "fa-solid fa-id-card",
    //       Catagory: "Open Account"
    //     },
    //     {
    //       Link: InitialInvestment,
    //       Icon: "fa-solid fa-money-bill-trend-up",
    //       Catagory: "Initial Investment"
    //     },
    //     {
    //       Link: Roles,
    //       Icon: "fa-solid fa-money-bill-trend-up",
    //       Catagory: "Roles"
    //     },
    //     {
    //       Link: MasterData,
    //       Icon: "fa-solid fa-upload",
    //       Catagory: "Upload Master Data"
    //     },
    //   ]
    // }];
    this.IsLoggedIn = true;
  }

  BuildMenu(menu: any) {
    this.Menu = [];
    let isActive = false;
    if(menu) {
      let parentItems = menu.filter(x => x.childs == null);
      if(parentItems.length > 0) {
        let filteredMenu = [];
        let menuItems = [];
        let i = 0;
        let index = 0;
        while(i < parentItems.length) {
          isActive = false;
          menuItems = menu.filter(x => x.childs === parentItems[i].catagory);
          index = menuItems.findIndex(x => x.link === this.MenuName);
          if(index >= 0) {
            isActive = true;
          }
          filteredMenu.push({
            name: parentItems[i].catagory,
            parentDetail: parentItems[i],
            value: menuItems,
            isActive: isActive
          });

          index = -1;
          i++;
        }

        this.Menu = filteredMenu.filter(x => x.value.length > 0);
      } else {
        ErrorToast("Hmm! Looks login issue. Please Login again.");
      }
    }
  }

  cleanupEmpId(link: string) {
    this.currentPage = link;
    this.nav.navigateRoot(link, null);
  }


  GoToLoginPage() {
    this.nav.navigate(Login, null);
  }

  toggleSection(e: any, index: number) {
    let elems: any = document.getElementById('menu-items');
    let h = elems.querySelectorAll('h4[name="menu-header"]');
    let d = elems.querySelectorAll('div[name="menu-body"]');
    let i = 0;
    while(i < h.length) {
      if(i === index) {
        h[i].classList.add('collapsed');
        d[i].classList.add('show');
      } else {
        h[i].classList.remove('collapsed');
        d[i].classList.remove('show');
      }
      i++;
    }
  }

  LogoutUser() {
    this.nav.logout();
    Toast("Log out successfully");
    this.nav.navigate("/", null);
  }

  activeTab(i: number) {
    let elem = document.getElementsByClassName("custom-accordion-btn");
    if (elem) {
      for (let j = 0; j < elem.length; j++) {
        if (elem[j].classList.contains("active-menu"))
          elem[j].classList.remove("active-menu");
      }
      elem[i].classList.add("active-menu");
    }
  }

  firstOpenToggle() {
    let accordionItemHeader = document.querySelector(".accordion-item-header");
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
     if(accordionItemHeader.classList.contains("active")) {
      (accordionItemBody as HTMLElement).style.maxHeight = accordionItemBody.scrollHeight + "px";
     }
     else {
       (accordionItemBody as HTMLElement).style.maxHeight = '0px';
     }
  }

  toogle(e: any) {
    let index = Number(e.currentTarget.getAttribute("data-index"));
    let elem = document.querySelectorAll(".accordion-item-header");
    elem.forEach(x => {
      let i = Number(x.getAttribute("data-index"));
      if (x.classList.contains("active") && i != index) {
        x.classList.toggle("active");
        let nextSibling = x.nextElementSibling;
        (nextSibling as HTMLElement).style.maxHeight = '0px';
      }
    })
    let accordionItemHeader = e.currentTarget;
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    let caret = document.getElementsByClassName("fa-caret-right");
    for (let i = 0; i < caret.length; i++) {
      if (caret[i].classList.contains("rotate-caret"))
      caret[i].classList.remove("rotate-caret");
    }
    if(accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
      e.currentTarget.getElementsByClassName("fa-caret-right")[0].classList.add("rotate-caret");
    }
    else {
      accordionItemBody.style.maxHeight = 0;
      e.currentTarget.getElementsByClassName("fa-caret-right")[0].classList.remove("rotate-caret");
    }
  }
}

interface PopOverDetail {
  imgName: string;
  name: string;
  time: string;
  message: string;
}
