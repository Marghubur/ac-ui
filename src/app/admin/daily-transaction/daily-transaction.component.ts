import { Component, OnInit } from '@angular/core';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { PaginationComponent } from '../../util/pagination/pagination.component';
import { BtRecordNotFoundComponent } from '../../util/bt-record-not-found/bt-record-not-found.component';
import { Filter } from '../../../providers/userService';
import { ResponseModel } from '../../../auth/jwtService';
import { Investment } from '../manage-user/manage-user.component';
import { CommonModule } from '@angular/common';
import { HideModal, ShowModal } from '../../../providers/common-service/common.service';

@Component({
  selector: 'app-daily-transaction',
  standalone: true,
  imports: [BreadcrumsComponent, PaginationComponent, BtRecordNotFoundComponent, CommonModule],
  templateUrl: './daily-transaction.component.html',
  styleUrl: './daily-transaction.component.scss'
})
export class DailyTransactionComponent implements OnInit {
  isPageReady: boolean = false;
  transactionData: Filter = new Filter();
  investmentDetail: Array<Investment> = [];
  selectedPayment: Investment = null;
  isLoading: boolean = false;

  constructor(private layout: LayoutComponent,
              private http: CoreHttpService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isPageReady = false;
    this.investmentDetail = [];
    this.http.post("investment/dailyTransaction", this.transactionData).then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.investmentDetail = res.ResponseBody;
        if (this.investmentDetail.length > 0)
          this.transactionData.totalRecords = this.investmentDetail[0].total;
        else
          this.transactionData.totalRecords = 0;
        console.table(this.investmentDetail);
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    }).catch(e => {
      this.isPageReady = true;
      this.layout.stopSkeleton();
    })
  }

  openPaymentPopUp(payment: Investment) {
    this.selectedPayment = payment;
    ShowModal("paymentModal");
  }

  getOrdinalInstallment(value: number, lastvalue: number): string {
    if (!value) return '';

    if (value != lastvalue) {
      const suffixes = ["th", "st", "nd", "rd"];
      const valueMod10 = value % 10;
      const valueMod100 = value % 100;

      let suffix = suffixes[0]; // Default to "th"

      if (valueMod10 >= 1 && valueMod10 <= 3 && !(valueMod100 >= 11 && valueMod100 <= 13) && !(valueMod100 >= 21 && valueMod100 <= 23) && !(valueMod100 >= 31 && valueMod100 <= 33) && !(valueMod100 >= 41 && valueMod100 <= 43)) {
        suffix = suffixes[valueMod10];
      }

      return value + suffix;
    } else {
      return "Last";
    }
  }

  makePayment() {
    if (this.selectedPayment) {
      this.isLoading = true;
      this.http.post("", this.selectedPayment).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.investmentDetail.find(x => x.investmentId == this.selectedPayment.investmentId).paidInstallment = this.selectedPayment.paidInstallment + 1;
          this.selectedPayment = null;
          this.isLoading = false;
          HideModal("paymentModal");
        }
      }).catch(e => {
        this.isLoading = false;
          HideModal("paymentModal");
      })
    }
  }
}