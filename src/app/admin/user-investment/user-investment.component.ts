import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { iNavigation } from '../../../providers/iNavigation';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { BtRecordNotFoundComponent } from '../../util/bt-record-not-found/bt-record-not-found.component';
import { PaginationComponent } from '../../util/pagination/pagination.component';
import { ResponseModel } from '../../../auth/jwtService';
import { Inventory, Investment } from '../manage-user/manage-user.component';
import { user } from '../user/user.component';
import { ErrorToast, ShowModal, ToLocateDate } from '../../../providers/common-service/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDetail } from '../daily-transaction/daily-transaction.component';

@Component({
  selector: 'app-user-investment',
  standalone: true,
  imports: [BtRecordNotFoundComponent, PaginationComponent, BreadcrumsComponent, CommonModule, FormsModule, NgbNavModule],
  templateUrl: './user-investment.component.html',
  styleUrl: './user-investment.component.scss'
})
export class UserInvestmentComponent implements OnInit {
  isPageReady: boolean = false;
  cdProductInvestment: Array<Inventory> = [];
  investmentDetail: Array<Investment> = [];
  private currentUser: user = null;
  customerInventoryDetail: Inventory = {
    cdProductId: 0,
    productName: "",
    emiAmount: null,
    finalPrice: null,
    period: null,
    downPayment: null,
    loanAmount: 0,
    totalPayableAmount: 0,
    payableAmountToOffice: null,
    emiStartDate: null,
    firstName: "",
    lastName: "",
    emiEndDate: null,
    depositDate: null,
    userId: 0,
    percentage: null
  };
  customerInvestmentDetail: Investment = {
    investmentId: 0,
    paidInstallment: 0,
    investmentAmount: null,
    addOn: 0,
    principalAmount: null,
    profitAmount: null,
    period: null,
    totalProfitAmount: null,
    totalPayableAmount: null,
    istPaymentDate: null,
    lastPaymentDate: null,
    investmentDate: null,
    scheme: null,
    firstName: null,
    lastName: null,
    accountId: null
  };
  active: number = 1;
  paymentDetails: Array<PaymentDetail> = [];

  constructor(private layout: LayoutComponent,
              private http: CoreHttpService,
              private nav: iNavigation
  ) {

  }
  ngOnInit(): void {
    let data = this.nav.getValue();
    if (data) {
      this.currentUser = data;
      this.loadInventoryData();      
    }
    else {
      ErrorToast("Invalid user data");
    }
  }

  loadInventoryData() {
    this.isPageReady = false;
    this.http.get(`inventory/getInventory/${this.currentUser.userId}`).then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.cdProductInvestment = res.ResponseBody;
        if (this.cdProductInvestment.length > 0) {
          this.cdProductInvestment.forEach(x => {
            x.emiStartDate = ToLocateDate(x.emiStartDate);
            x.emiEndDate = ToLocateDate(x.emiEndDate);
            x.depositDate = ToLocateDate(x.createdOn);
          })
        }
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    }).catch(e => {
      this.isPageReady = true;
        this.layout.stopSkeleton();
    })
  }

  loadInvestmentData() {
    this.isPageReady = false;
    this.http.get(`investment/getInvestment/${this.currentUser.userId}`).then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.investmentDetail = res.ResponseBody;
        if (this.investmentDetail.length > 0) {
          this.investmentDetail.forEach(x => {
            x.investmentDate = ToLocateDate(x.investmentDate);
            x.istPaymentDate = ToLocateDate(x.istPaymentDate);
            x.lastPaymentDate = ToLocateDate(x.lastPaymentDate);
          })
        }
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    }).catch(e => {
      this.isPageReady = true;
        this.layout.stopSkeleton();
    })
  }

  viewInventory(item: Inventory) {
    this.customerInventoryDetail = item;
    this.customerInventoryDetail.firstName = this.currentUser.firstName;
    this.customerInventoryDetail.lastName = this.currentUser.lastName;
    this.customerInventoryDetail.payableAmountToOffice = (this.customerInventoryDetail.loanAmount * this.customerInventoryDetail.percentage) / 100;
    this.customerInventoryDetail.accountId = this.currentUser.accountId;
    ShowModal("InventoryCustomerViewModal");
  }

  viewInvestment(item: Investment) {
    this.customerInvestmentDetail = item;
    this.customerInvestmentDetail.firstName = this.currentUser.firstName;
    this.customerInvestmentDetail.lastName = this.currentUser.lastName;
    this.customerInvestmentDetail.accountId = this.currentUser.accountId;
    this.customerInvestmentDetail.principalAmount = this.customerInvestmentDetail.principalAmount * this.customerInvestmentDetail.period;
    this.customerInvestmentDetail.profitAmount = this.customerInvestmentDetail.profitAmount * this.customerInvestmentDetail.period;
    this.customerInvestmentDetail.totalProfitAmount = this.customerInvestmentDetail.totalProfitAmount * this.customerInvestmentDetail.period;
    ShowModal("InvestmentViewCustomerModal");
  }

  printCustomerSlip(id: string) {
    const modal  = document.getElementById(id);
    if (modal) {
      const clonedModal = modal.cloneNode(true) as HTMLElement;
      const inputs = clonedModal.querySelectorAll('input');
      inputs.forEach((input: HTMLInputElement) => {
        const value = input.value;
        input.setAttribute('readonly', 'false'); // Optional: make it read-only for print
        input.setAttribute ('value', value); // Set the value for printing
      });
      clonedModal.querySelector(".modal-dialog").classList.remove("modal-dialog-centered");
      const printWindow = window.open('', '_blank');

      printWindow!.document.write(`
        <html>
          <head>
            <title>Print</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="container">
              ${clonedModal.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow!.document.close();
      printWindow!.focus();
    }
  }

  viewPaymentDetail(investmentDetail: Investment) {
    if (investmentDetail && investmentDetail.paymentDetail) {
      this.paymentDetails = [];
      this.paymentDetails = JSON.parse(investmentDetail.paymentDetail);
      ShowModal("viewInvestmentPaymentModal");
    }
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
}
