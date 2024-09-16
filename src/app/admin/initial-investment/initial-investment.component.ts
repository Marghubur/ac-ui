import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { NgbDatepickerModule, NgbDateStruct, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { CommonModule } from '@angular/common';
import { ErrorToast } from '../../../providers/common-service/common.service';
import { autoCompleteModal, IautocompleteComponent, pairData } from '../../util/iautocomplete/iautocomplete.component';
import { Filter } from '../../../providers/userService';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { ResponseModel } from '../../../auth/jwtService';
import { user } from '../user/user.component';

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
  inventoryDetail: Inventory = {
    inventoryId: 0,
    inventoryName: "",
    emiAmount: null,
    onRoadPrice: null,
    months: null,
    downPayment: null,
    loanAmount: 0,
    totalPayableAmount: 0,
    payableAmountToOffice: 0,
    emiStartDate: null,
    userId: 0
  };
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  investmentForm: FormGroup;
  investmentDetail: Investment = {
    addOn: 0,
    investmentAmount: null,
    investmentId: 0,
    months: 0,
    paymentDate: null,
    profitAmount: 0,
    totalPayableAmount: 0,
    scheme: null
  };
  model: NgbDateStruct;
  paymentModel: NgbDateStruct;
  customerInventoryDetail: Inventory = {
    inventoryId: 0,
    inventoryName: "",
    emiAmount: null,
    onRoadPrice: null,
    months: null,
    downPayment: null,
    loanAmount: 0,
    totalPayableAmount: 0,
    payableAmountToOffice: null,
    emiStartDate: null,
    firstName: "",
    lastName: "",
    emiEndDate: null,
    depositDate: null,
    userId: 0
  };
  customerInvestmentDetail: Investment = {
    addOn: 0,
    investmentAmount: null,
    investmentId: 0,
    months: null,
    paymentDate: null,
    profitAmount: null,
    totalPayableAmount: null,
    scheme: null,
    totalProfitAmount: null,
    firstName: "",
    lastName: ""
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
      inventoryId: new FormControl(this.inventoryDetail.inventoryId),
      userId: new FormControl(this.userId),
      inventoryName: new FormControl(this.inventoryDetail.inventoryName, [Validators.required]),
      emiAmount: new FormControl(this.inventoryDetail.emiAmount, [Validators.required]),
      onRoadPrice: new FormControl(this.inventoryDetail.onRoadPrice, [Validators.required]),
      months: new FormControl(this.inventoryDetail.months, [Validators.required]),
      downPayment: new FormControl(this.inventoryDetail.downPayment, [Validators.required]),
      loanAmount: new FormControl(this.inventoryDetail.loanAmount),
      totalPayableAmount: new FormControl(this.inventoryDetail.totalPayableAmount),
      payableAmountToOffice: new FormControl(this.inventoryDetail.payableAmountToOffice),
      emiStartDate: new FormControl(this.inventoryDetail.emiStartDate, [Validators.required]),
      emiEndDate: new FormControl(this.inventoryDetail.emiEndDate)
    })
  }

  calculateTotalPayableAmount() {
    let emiAmount: number = this.inventoryForm.get("emiAmount").value;
    let months: number = this.inventoryForm.get("months").value;
    this.inventoryForm.get("totalPayableAmount").setValue(emiAmount * months);
  }

  calculateLoanAmount() {
    let onRoadPrice: number = this.inventoryForm.get("onRoadPrice").value;
    let downPayment: number = this.inventoryForm.get("downPayment").value;
    let amount = onRoadPrice - downPayment;
    this.inventoryForm.get("loanAmount").setValue(amount);

    this.calculatePaybleOfficeAmount(amount);
  }

  private calculatePaybleOfficeAmount(amount: number) {
    let payableAmount = amount * 0.70;
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
    emiEnddate.setMonth(emiEnddate.getMonth() + value.months);
    this.inventoryForm.get("emiEndDate").setValue(emiEnddate);
    this.inventoryForm.get("userId").setValue(this.userId);

    this.http.post("inventory/addInventory", this.inventoryForm.value).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.resetInventoryDetail();
        this.customerInventoryDetail = res.ResponseBody;
        this.customerInventoryDetail.accountId = this.selectedUser.accountId;
        this.customerInventoryDetail.firstName = this.selectedUser.firstName;
        this.customerInventoryDetail.lastName = this.selectedUser.lastName;
        this.customerInventoryDetail.depositDate = res.ResponseBody.createdOn;
        this.customerInventoryDetail.payableAmountToOffice = value.payableAmountToOffice;
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
    this.inventoryDetail = {
      inventoryId: 0,
      inventoryName: "",
      emiAmount: null,
      onRoadPrice: null,
      months: null,
      downPayment: null,
      loanAmount: 0,
      totalPayableAmount: 0,
      payableAmountToOffice: 0,
      emiStartDate: null,
      userId: 0
    };
    this.customerInventoryDetail = {
      inventoryId: 0,
      inventoryName: "",
      emiAmount: null,
      onRoadPrice: null,
      months: null,
      downPayment: null,
      loanAmount: 0,
      totalPayableAmount: 0,
      payableAmountToOffice: null,
      emiStartDate: null,
      firstName: "",
      lastName: "",
      emiEndDate: null,
      userId: 0
    };
    this.initinventoryForm();
  }

  initInvestmentForm() {
    this.investmentForm = this.fb.group({
      investmentId: new FormControl(this.investmentDetail.investmentId),
      investmentAmount: new FormControl(this.investmentDetail.investmentAmount, [Validators.required]),
      profitAmount: new FormControl(this.investmentDetail.profitAmount),
      addOn: new FormControl(this.investmentDetail.addOn),
      months: new FormControl(this.investmentDetail.months),
      paymentDate: new FormControl(this.investmentDetail.paymentDate, [Validators.required]),
      totalPayableAmount: new FormControl(this.investmentDetail.totalPayableAmount),
      scheme: new FormControl(this.investmentDetail.scheme, [Validators.required])
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
      months: null,
      paymentDate: null,
      profitAmount: null,
      totalPayableAmount: null,
      scheme: null,
      totalProfitAmount: null,
      firstName: "",
      lastName: ""
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
      months: 0,
      paymentDate: null,
      profitAmount: 0,
      totalPayableAmount: 0,
      scheme: null
    };
    this.customerInvestmentDetail = {
      addOn: 0,
      investmentAmount: null,
      investmentId: 0,
      months: null,
      paymentDate: null,
      profitAmount: null,
      totalPayableAmount: null,
      scheme: null,
      totalProfitAmount: null,
      firstName: "",
      lastName: ""
    }
    this.initInvestmentForm();
    this.userId = 0;
    this.selectedUser = null;
  }

  selectScheme(e: any) {
    let value = Number(e.target.value);
    if (value == 1) {
      this.investmentForm.get("months").setValue(20);
      this.investmentForm.get("profitAmount").setValue(12000);
      this.investmentForm.get("totalPayableAmount").setValue(12000 * 20);
    } else {
      this.investmentForm.get("months").setValue(14);
      this.investmentForm.get("profitAmount").setValue(14000);
      this.investmentForm.get("totalPayableAmount").setValue(14000 * 14);
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
}

interface Inventory {
  inventoryId: number;
  inventoryName: string;
  emiAmount: number;
  onRoadPrice: number;
  months: number;
  downPayment: number;
  loanAmount: number;
  totalPayableAmount: number;
  payableAmountToOffice: number;
  emiStartDate: Date;
  emiEndDate?: Date;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  depositDate?: Date;
  userId: number;
}

interface Investment {
  investmentId: number,
  investmentAmount: number;
  profitAmount: number;
  addOn: number;
  months: number;
  paymentDate: Date;
  totalPayableAmount: number;
  scheme: number;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  totalProfitAmount?: number;
}
