import { Component, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  RouterOutlet,
} from "@angular/router";
import { CommonService } from '../../../providers/common-service/common.service';
import { Login } from '../../../providers/constants';
import { iNavigation } from '../../../providers/iNavigation';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { PagePlaceholderComponent, PlaceholderTag } from '../../util/page-placeholder/page-placeholder.component';
import { SkeletonService } from '../../../providers/skeleton.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [CommonModule, NavbarComponent, SidemenuComponent, RouterOutlet, PagePlaceholderComponent]
})
export class LayoutComponent implements OnInit {
  title = "star-admin-angular";
  enableAuth: boolean = false;
  pageName: string = "";
  activePage:number = 0;
  isMinimize: boolean = false;
  isInitialPage: boolean = false;

  matrix: Array<PlaceholderTag> = [];

  displayActivePage(activePageNumber:number){
    this.activePage = activePageNumber
  }

  constructor(
    private router: Router,
    private commonService: CommonService,
    private nav: iNavigation,
    private skeletonService: SkeletonService
  ) {
    this.GetScreenHeight();
    this.getMatrix(this.nav.getTopRoute());
    this.commonService.isMinimize.subscribe(res => {
      this.isMinimize = res;
    })
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.pageName = event.url.replace("/", "")
        this.getMatrix(this.pageName);
        this.nav.manageLocalSessionKey(this.pageName);
        this.startSkeleton();
        switch (event.url) {
          case "/login":
            this.enableAuth = true;
            break;
          default:
            this.enableAuth = false;
            break;
        }
      }
    });
  }

  private getMatrix(pageName: string) {
    this.matrix = this.skeletonService.getPageMatrix(pageName)
  }

  public startSkeleton() {
    let elem = document.getElementById("placeholder-container");
    if (elem) {
      elem.classList.remove('d-none');
      document.getElementById("content-container").classList.add('d-none');
    }
  }

  public stopSkeleton() {
    let elem = document.getElementById("placeholder-container");
    if (elem) {
      elem.classList.add('d-none');
      document.getElementById("content-container").classList.remove('d-none');
    }
  }

  doAuthentication() {
    this.enableAuth = true;
    this.nav.navigate(Login, null);
  }

  ngOnInit() {
    this.enableAuth = false;
  }

  RemovePopup() {
    document.getElementById("sessionexpiredBox").classList.add('d-none');
  }

  GetScreenHeight() {
    var width = 0,
      height = 0;
    if (typeof window.innerWidth == "number") {
      //Non-IE
      width = window.innerWidth;
      height = window.innerHeight;
    } else if (
      document.documentElement &&
      (document.documentElement.clientWidth ||
        document.documentElement.clientHeight)
    ) {
      //IE 6+ in 'standards compliant mode'
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    } else if (
      document.body &&
      (document.body.clientWidth || document.body.clientHeight)
    ) {
      //IE 4 compatible
      width = document.body.clientWidth;
      height = document.body.clientHeight;
    }
    this.commonService.SetWindowdDetail(height, width);
  }
}
