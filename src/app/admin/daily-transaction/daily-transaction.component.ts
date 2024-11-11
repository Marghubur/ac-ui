import { Component, OnInit } from '@angular/core';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { PaginationComponent } from '../../util/pagination/pagination.component';
import { BtRecordNotFoundComponent } from '../../util/bt-record-not-found/bt-record-not-found.component';
import { Filter } from '../../../providers/userService';
import { ResponseModel } from '../../../auth/jwtService';
import { CommonModule } from '@angular/common';
import { HideModal, ShowModal, Toast } from '../../../providers/common-service/common.service';
import { NgbDatepickerModule, NgbDateStruct, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CDProduct, Investment, PaymentDetail, TransactionFilter } from '../../adminInterfacemodal/admin-interface-modals';

@Component({
  selector: 'app-daily-transaction',
  standalone: true,
  imports: [BreadcrumsComponent, PaginationComponent, BtRecordNotFoundComponent, CommonModule, NgbDatepickerModule, FormsModule, NgbNavModule],
  templateUrl: './daily-transaction.component.html',
  styleUrl: './daily-transaction.component.scss'
})
export class DailyTransactionComponent implements OnInit {
  active = 1;
  isPageReady: boolean = false;
  transactionData: Filter = new Filter();
  investmentDetail: Array<Investment> = [];
  cdProductDetail: Array<CDProduct> = [];
  selectedInvestmentPayment: Investment = null;
  selectedCDProductPayment: CDProduct = null;
  isLoading: boolean = false;
  paymentDetails: Array<PaymentDetail> = [];
  fromModel: NgbDateStruct;
  toModel: NgbDateStruct;
  transactionFilter: TransactionFilter = {
    fromDate: null,
    name: null,
    status: null,
    toDate: null
  };

  constructor(private layout: LayoutComponent,
              private http: CoreHttpService) {}

  ngOnInit(): void {
    this.loadInvestmentData();
  }

  getInvestmentDetail() {
    this.transactionData.reset();
    this.loadInvestmentData();
  }

  private loadInvestmentData() {
    this.isPageReady = false;
    this.investmentDetail = [];

    if (!this.transactionData.searchString.includes("p.paymentDate")) {
      let today = new Date();
      this.transactionData.searchString += ` and p.paymentDate = '${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}'`;
    }

    this.http.post("investment/dailyTransaction", this.transactionData).then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.buildDailyInvestment(res.ResponseBody)
        Toast("Data loaded");
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    }).catch(e => {
      this.isPageReady = true;
      this.layout.stopSkeleton();
    })
  }

  private buildDailyInvestment(res: any) {
    this.investmentDetail = res;
    if (this.investmentDetail.length > 0) {
      this.transactionData.totalRecords = this.investmentDetail[0].total;
    }
    else {
      this.transactionData.totalRecords = 0;
    }
  }

  getCDProductDetail() {
    this.transactionData.reset();
    this.loadCDProductData();
  }

  private loadCDProductData() {
    this.isPageReady = false;
    this.cdProductDetail = [];
    
    if (!this.transactionData.searchString.includes("p.paymentDate")) {
      let today = new Date();
      this.transactionData.searchString += ` and p.paymentDate = '${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}'`;
    }

    this.http.post("cdproduct/dailyCDProductTransaction", this.transactionData).then((res:ResponseModel) => {
      if (res.ResponseBody) {
        this.buildDailyCDProductDetail(res.ResponseBody)
        Toast("Data loaded");
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    }).catch(e => {
      this.isPageReady = true;
      this.layout.stopSkeleton();
    })
  }

  private buildDailyCDProductDetail(res: any) {
    this.cdProductDetail = res;
    if (this.cdProductDetail.length > 0) {
      this.transactionData.totalRecords = this.cdProductDetail[0].total;
    }
    else {
      this.transactionData.totalRecords = 0;
    }
  }

  openPaymentPopUp(payment: Investment) {
    this.selectedInvestmentPayment = payment;
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
    if (this.selectedInvestmentPayment) {
      this.isLoading = true;
      this.http.get(`investment/payInvestmentAmount/${this.selectedInvestmentPayment.investmentId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.selectedInvestmentPayment = null;
          this.investmentDetail = [];
          this.buildDailyInvestment(res.ResponseBody);
          Toast("Payment successfully");
          this.isLoading = false;
          HideModal("paymentModal");
        }
      }).catch(e => {
        this.isLoading = false;
        HideModal("paymentModal");
      })
    }
  }

  viewPaymentDetail(investmentDetail: Investment) {
    this.paymentDetails = [];
    if (investmentDetail && investmentDetail.investmentId > 0) {
      this.isLoading = true;
      this.http.get(`paymentDetail/getInvestmentPaymentDetail/${investmentDetail.investmentId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.paymentDetails = res.ResponseBody;
          this.isLoading = false;
          ShowModal("viewPaymentModal");
        }
      })
    }
  }

  onFromDateSelection(e: NgbDateStruct) {
    this.transactionFilter.fromDate = new Date(e.year, e.month - 1, e.day);
  }

  onToDateSelection(e: NgbDateStruct) {
    this.transactionFilter.toDate = new Date(e.year, e.month - 1, e.day);
  }

  fiterRecord() {
    this.transactionData.searchString = "1=1";
    if(this.transactionFilter.fromDate !== null && this.transactionFilter.toDate !== null) {
      this.transactionData.searchString += ` And p.paymentDate between '${this.transactionFilter.fromDate.getFullYear()}-${this.transactionFilter.fromDate.getMonth()+1}-${this.transactionFilter.fromDate.getDate()}' And '${this.transactionFilter.toDate.getFullYear()}-${this.transactionFilter.toDate.getMonth()+1}-${this.transactionFilter.toDate.getDate()}'`;
    } else{
      let today = new Date();
      this.transactionData.searchString += ` and p.paymentDate = '${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}'`;
    }

    if(this.transactionFilter.name !== null && this.transactionFilter.name !== "") {
      this.transactionData.searchString += ` And u.firstName like '%${this.transactionFilter.name}%' or u.lastName like '%${this.transactionFilter.name}%'`;
    }

    if(this.transactionFilter.status !== null) {
      this.transactionData.searchString += ` And p.isPaid = ${this.transactionFilter.status}`;
    }

    this.layout.startSkeleton();
    if (this.active == 1) {
      this.loadInvestmentData();
    } else {
      this.loadCDProductData();
    }
  }

  resetFilter() {
    this.transactionFilter = {
      fromDate: null,
      name: null,
      status: null,
      toDate: null
    };

    this.transactionData.reset();
    this.layout.startSkeleton();
    if (this.active == 1) {
      this.loadInvestmentData();
    } else {
      this.loadCDProductData();
    }
  }

  GetCdProductFilterResult(e: Filter) {
    if(e != null) {
      this.transactionData = e;
      this.loadCDProductData();
    }
  }

  GetFilterResult(e: Filter) {
    if(e != null) {
      this.transactionData = e;
      this.loadInvestmentData();
    }
  }

  openCDProductPaymentPopUp(cdProduct: CDProduct) {
    this.selectedCDProductPayment = cdProduct;
    ShowModal("cdProductPaymentModal");
  }

  viewCDProductPaymentDetail(cdProduct: CDProduct) {
    this.paymentDetails = [];
    if (cdProduct && cdProduct.cdProductId > 0) {
      this.isLoading = true;
      this.http.get(`paymentDetail/getCDPaymentDetail/${cdProduct.cdProductId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.paymentDetails = res.ResponseBody;
          this.isLoading = false;
          ShowModal("viewPaymentModal");
        }
      })
    }
  }

  makeCDProductPayment() {
    if (this.selectedCDProductPayment) {
      this.isLoading = true;
      this.http.get(`cdproduct/payInvestmentAmount/${this.selectedCDProductPayment.cdProductId}`).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.selectedCDProductPayment = null;
          this.cdProductDetail = [];
          this.buildDailyCDProductDetail(res.ResponseBody);
          Toast("Payment successfully");
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