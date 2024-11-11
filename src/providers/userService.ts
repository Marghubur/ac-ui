import { Injectable } from "@angular/core";
import { UserDetail } from "./common-service/common.service";
import { Master } from "./constants";

@Injectable()
export class UserService {
    private userModel: UserDetail = null;
    getInstance(): UserDetail {
        let localUserData = localStorage.getItem(Master);
        if (localUserData !== null && localUserData !== "") {
            localUserData = JSON.parse(localUserData);
            this.userModel = localUserData["UserDetail"] as UserDetail;
        } else {
            this.userModel = new UserDetail();
        }
        return this.userModel;
    }
}

export class Filter {
  employeeId?: number = 0;
  clientId?: number = 0;
  searchString: string = "1=1";
  pageIndex: number = 1;
  startIndex?: number = 0;
  endIndex?: number = 0;
  pageSize: number = 10;
  sortBy?: string = "";
  companyId: number = 0;
  totalRecords?: number = 0;
  showPageNo?: number = 5;
  activePageNumber?: number = 1;
  isReUseSame?: boolean = false;
  isActive?: boolean = true;
  sortDirection?: string = null;
  forYear?: number = 0;
  forMonth?: number = 0;

  update(total: any) {
    if(!isNaN(Number(total))) {
      this.totalRecords = total;
      this.startIndex = 1;
      this.pageIndex = 1;
    }
  }

  reset() {
    this.totalRecords = 0;
    this.startIndex = 1;
    this.pageIndex = 1;
    this.activePageNumber = 1;
    this.sortDirection = null;
    this.searchString = "1=1";
  }
}
