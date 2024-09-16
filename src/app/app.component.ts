import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  RouterOutlet,
} from "@angular/router";
import { Subscription } from 'rxjs';
import { CommonService } from '../providers/common-service/common.service';
import { iNavigation } from '../providers/iNavigation';
import { Login } from '../providers/constants';
import { ToastComponent } from './toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ToastComponent, RouterOutlet]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "star-admin-angular";
  pageName: string = "";
  activePage:number = 0;
  navRouter: Subscription = null;

  displayActivePage(activePageNumber:number){
    this.activePage = activePageNumber
  }

  constructor(
    private router: Router,
    private commonService: CommonService,
    private nav: iNavigation,
  ) {
    this.GetScreenHeight();
    this.navRouter = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.pageName = event.url.replace("/", "")
        this.commonService.SetCurrentPageName(this.pageName);
        this.nav.manageLocalSessionKey(this.pageName);
        this.nav.pushRoute(this.pageName);
      }
    });
  }

  ngOnDestroy(): void {
    this.navRouter.unsubscribe();
  }

  doAuthentication() {
    this.nav.navigate(Login, null);
  }

  ngOnInit() {
    //alert(this.version)
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

  closeToast() {
    document.getElementById("toast").classList.add("d-none");
    let $Toast = document.getElementById("toast");
    let $Error = document.getElementById("warning-box");
    let $Warning = document.getElementById("error-box");
    if ($Toast) {
      $Toast.classList.add("d-none");
      $Error.classList.add("d-none");
      $Warning.classList.add("d-none");
    }
  }
}
