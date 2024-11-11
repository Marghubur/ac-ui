import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { NgbDatepickerModule, NgbDateStruct, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { CommonModule } from '@angular/common';
import { ErrorToast, ToLocateDate } from '../../../providers/common-service/common.service';
import { autoCompleteModal, IautocompleteComponent, pairData } from '../../util/iautocomplete/iautocomplete.component';
import { Filter } from '../../../providers/userService';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { ResponseModel } from '../../../auth/jwtService';
import { CDProduct, Investment, user } from '../../adminInterfacemodal/admin-interface-modals';

@Component({
  selector: 'app-initial-investment',
  standalone: true,
  imports: [NgbNavModule, BreadcrumsComponent, NgbDatepickerModule, FormsModule, AllownumberDirective, ReactiveFormsModule, CommonModule, IautocompleteComponent],
  templateUrl: './initial-investment.component.html',
  styleUrl: './initial-investment.component.scss'
})
export class InitialInvestmentComponent implements OnInit {
  active = 1;
  inventoryForm: FormGroup;
  cdProductInvestment: CDProduct = {
    cdProductId: 0,
    productName: "",
    emiAmount: null,
    finalPrice: null,
    period: null,
    downPayment: null,
    loanAmount: 0,
    totalPayableAmount: 0,
    payableAmountToOffice: 0,
    emiStartDate: null,
    userId: 0,
    percentage: null
  };
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  investmentForm: FormGroup;
  investmentDetail: Investment = {
    addOn: 0,
    investmentAmount: null,
    investmentId: 0,
    period: 0,
    paymentDate: null,
    profitAmount: null,
    totalPayableAmount: 0,
    scheme: null,
    principalAmount: null,
    totalProfitAmount: null
  };
  model: NgbDateStruct;
  paymentModel: NgbDateStruct;
  customerInventoryDetail: CDProduct = {
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
    addOn: 0,
    investmentAmount: null,
    investmentId: 0,
    period: null,
    paymentDate: null,
    profitAmount: null,
    totalPayableAmount: null,
    scheme: null,
    totalProfitAmount: null,
    firstName: "",
    lastName: "",
    principalAmount: null
  };
  userId: number = 0;
  autoCompleteModal: autoCompleteModal = new autoCompleteModal();
  allUser: Array<user> = [];
  selectedUser: user = null;

  constructor(private layout: LayoutComponent,
              private fb: FormBuilder,
              private http: CoreHttpService) {}

  ngOnInit() {
    this.autoCompleteModal.placeholder = "Select User";
    this.autoCompleteModal.className = "";
    this.layout.stopSkeleton();
    this.initinventoryForm();
    this.initInvestmentForm();
  }

  initinventoryForm() {
    this.inventoryForm = this.fb.group({
      cdProductId: new FormControl(this.cdProductInvestment.cdProductId),
      userId: new FormControl(this.userId),
      productName: new FormControl(this.cdProductInvestment.productName, [Validators.required]),
      emiAmount: new FormControl(this.cdProductInvestment.emiAmount, [Validators.required]),
      finalPrice: new FormControl(this.cdProductInvestment.finalPrice, [Validators.required]),
      period: new FormControl(this.cdProductInvestment.period, [Validators.required]),
      downPayment: new FormControl(this.cdProductInvestment.downPayment, [Validators.required]),
      loanAmount: new FormControl(this.cdProductInvestment.loanAmount),
      totalPayableAmount: new FormControl(this.cdProductInvestment.totalPayableAmount),
      payableAmountToOffice: new FormControl(this.cdProductInvestment.payableAmountToOffice),
      emiStartDate: new FormControl(this.cdProductInvestment.emiStartDate, [Validators.required]),
      emiEndDate: new FormControl(this.cdProductInvestment.emiEndDate),
      percentage: new FormControl(this.cdProductInvestment.percentage, [Validators.required])
    })
  }

  calculateTotalPayableAmount() {
    let emiAmount: number = this.inventoryForm.get("emiAmount").value;
    let period: number = this.inventoryForm.get("period").value;
    this.inventoryForm.get("totalPayableAmount").setValue(emiAmount * period);
  }

  calculateLoanAmount() {
    let finalPrice: number = this.inventoryForm.get("finalPrice").value;
    let downPayment: number = this.inventoryForm.get("downPayment").value;
    let amount = finalPrice- downPayment;
    this.inventoryForm.get("loanAmount").setValue(amount);

    this.calculatePaybleOfficeAmount(amount);
  }

  private calculatePaybleOfficeAmount(amount: number) {
    let percentage = Number(this.inventoryForm.get("percentage").value);
    let payableAmount = amount * percentage;
    this.inventoryForm.get("payableAmountToOffice").setValue(payableAmount);
  }

  onDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.inventoryForm.controls["emiStartDate"].setValue(date);

  }

  saveTwoWheelerInvestment() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.inventoryForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory filled");
      return;
    }

    let value = this.inventoryForm.value;
    let emiEnddate = new Date(value.emiStartDate);
    emiEnddate.setMonth(emiEnddate.getMonth() + value.period);
    this.inventoryForm.get("emiEndDate").setValue(emiEnddate);
    this.inventoryForm.get("userId").setValue(this.userId);

    this.http.post("cdproduct/addCDProductInvestment", this.inventoryForm.value).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.resetInventoryDetail();
        this.customerInventoryDetail = res.ResponseBody;
        this.customerInventoryDetail.accountId = this.selectedUser.accountId;
        this.customerInventoryDetail.firstName = this.selectedUser.firstName;
        this.customerInventoryDetail.lastName = this.selectedUser.lastName;
        this.customerInventoryDetail.depositDate = res.ResponseBody.createdOn;
        this.customerInventoryDetail.payableAmountToOffice = value.payableAmountToOffice;
        this.customerInventoryDetail.emiStartDate = ToLocateDate(this.customerInventoryDetail.emiStartDate);
        this.customerInventoryDetail.emiEndDate = ToLocateDate(this.customerInventoryDetail.emiEndDate);
        this.customerInventoryDetail.depositDate = ToLocateDate(this.customerInventoryDetail.depositDate);
        this.isLoading = false;
        this.isSubmitted = false;
      }
    })

    this.isLoading = false;
  }

  get f() {
    return this.inventoryForm.controls;
  }

  resetInventoryForm() {
    this.resetInventoryDetail();
    this.isLoading = false;
    this.isSubmitted = false;
    this.selectedUser = null;
    this.userId = 0;
  }

  resetInventoryDetail() {
    this.cdProductInvestment = {
      cdProductId: 0,
      productName: "",
      emiAmount: null,
      finalPrice: null,
      period: null,
      downPayment: null,
      loanAmount: 0,
      totalPayableAmount: 0,
      payableAmountToOffice: 0,
      emiStartDate: null,
      userId: 0,
      percentage: null
    };
    this.customerInventoryDetail = {
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
      userId: 0,
      percentage: null
    };
    this.initinventoryForm();
  }

  initInvestmentForm() {
    this.investmentForm = this.fb.group({
      investmentId: new FormControl(this.investmentDetail.investmentId),
      investmentAmount: new FormControl(this.investmentDetail.investmentAmount, [Validators.required]),
      profitAmount: new FormControl(this.investmentDetail.profitAmount),
      addOn: new FormControl(this.investmentDetail.addOn),
      period: new FormControl(this.investmentDetail.period),
      paymentDate: new FormControl(this.investmentDetail.paymentDate, [Validators.required]),
      totalPayableAmount: new FormControl(this.investmentDetail.totalPayableAmount),
      scheme: new FormControl(this.investmentDetail.scheme, [Validators.required]),
      totalProfitAmount: new FormControl(this.investmentDetail.totalProfitAmount, [Validators.required]),
      principalAmount: new FormControl(this.investmentDetail.principalAmount, [Validators.required]),
    })
  }

  get m() {
    return this.investmentForm.controls;
  }

  saveInvestment() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.investmentForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory filled");
      return;
    }

    this.customerInvestmentDetail = {
      addOn: 0,
      investmentAmount: null,
      investmentId: 0,
      period: null,
      paymentDate: null,
      profitAmount: null,
      totalPayableAmount: null,
      scheme: null,
      totalProfitAmount: null,
      firstName: "",
      lastName: "",
      principalAmount: null,
    }

    this.customerInvestmentDetail = this.investmentForm.value;
    this.customerInvestmentDetail.totalProfitAmount = this.customerInvestmentDetail.totalPayableAmount - this.customerInvestmentDetail.investmentAmount;

    this.isLoading = false;
  }

  resetInvestmentForm() {
    this.isLoading = false;
    this.isSubmitted = false;
    this.investmentDetail = {
      addOn: 0,
      investmentAmount: null,
      investmentId: 0,
      period: 0,
      paymentDate: null,
      profitAmount: null,
      totalPayableAmount: 0,
      scheme: null,
      principalAmount: null,
      totalProfitAmount: null
    };
    this.customerInvestmentDetail = {
      addOn: 0,
      investmentAmount: null,
      investmentId: 0,
      period: null,
      paymentDate: null,
      profitAmount: null,
      totalPayableAmount: null,
      scheme: null,
      totalProfitAmount: null,
      firstName: "",
      lastName: "",
      principalAmount: null,
    }
    this.initInvestmentForm();
    this.userId = 0;
    this.selectedUser = null;
  }

  selectScheme(e: any) {
    let value = Number(e.target.value);
    if (value == 1) {
      this.investmentForm.get("period").setValue(20);
    } else {
      this.investmentForm.get("period").setValue(14);
    }
  }

  onPaymentDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.investmentForm.controls["paymentDate"].setValue(date);
  }

  selectUser(e: any) {
    this.selectedUser = this.allUser.find(x => x.userId == this.userId);
  }

  async serverFilter(query: string) {
    let filter: Filter = new Filter();
    if (query == null || query == "") {
      filter.searchString = "1=1 ";
    } else {
      filter.searchString = ` 1=1 and firstName like '%${query}%' or lastName like '%${query}%'`;
    }

    filter.pageIndex = 1;
    filter.pageSize = 100;
    filter.companyId = 1;

    let result: ResponseModel = await this.http.post("user/filterUser", filter);
    if (result.ResponseBody) {
      this.allUser = result.ResponseBody;
      let data: Array<pairData> = [];
      result.ResponseBody.forEach(x => {
        data.push({
          value: x.userId,
          text: `${x.firstName} ${x.lastName} [${x.mobileNumber}]`
        })
      });
      this.autoCompleteModal = {
        data: data,
        placeholder: "Select User",
        className: "normal"
      };
    };
  }

  printCustomerSlip() {
    window.print();
  }

  calculateTotalProfitAmount() {
    let profitAmt = this.investmentForm.get("profitAmount").value;
    let addon = this.investmentForm.get("addOn").value;
    let principalAmt = this.investmentForm.get("principalAmount").value;

    let totalProfitAmt = Number(profitAmt) + Number(addon) + Number(principalAmt);
    this.investmentForm.get("totalProfitAmount").setValue(totalProfitAmt);

    let month =  Number(this.investmentForm.get("period").value);
    this.investmentForm.get("totalPayableAmount").setValue(totalProfitAmt * month);
  }
}
