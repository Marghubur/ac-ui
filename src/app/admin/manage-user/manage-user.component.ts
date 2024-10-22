import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { convertToUppercase, ErrorToast, FireBrowser, HideModal, ShowModal, Toast, ToLocateDate } from '../../../providers/common-service/common.service';
import { AllownumberDirective } from '../../util/directives/allownumber.directive';
import { ProfileImage, User, UserImage } from '../../../providers/constants';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { iNavigation } from '../../../providers/iNavigation';
import { CoreHttpService } from '../../../providers/AjaxServices/core-http.service';
import { ResponseModel } from '../../../auth/jwtService';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [BreadcrumsComponent, FormsModule, ReactiveFormsModule, CommonModule, AllownumberDirective, NgbDatepickerModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit {
  userForm: FormGroup;
  isSubmitted: boolean = false;
  profileURL: string = UserImage;
  private fileDetail: Array<any> = [];
  private imageIndex: number = 0;
  model: NgbDateStruct;
  minDate: any = null;
  private userDetail: User ={
    accountId: null,
    address: null,
    aadharNumber: null,
    dob: null,
    emailId: null,
    firstName: null,
    lastName: null,
    mobileNumber: null,
    ProfileImgPath: null,
    referenceBy: null,
    userId: 0,
    productType: null
  };
  isLoading: boolean = false;
  isPageReady: boolean = false;
  private userId: number = 0;
  isCameraOpen = false;
  stream: MediaStream | null = null;
  private isCapturePhoto: boolean = false;
  @ViewChild('videoElement') videoElement!: ElementRef;
  active: number = null;
  inventoryForm: FormGroup;
  cdProductInvestment: Inventory = {
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
  investmentForm: FormGroup;
  investmentDetail: Investment = {
    paidInstallment: 0,
    investmentId: 0,
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
  emiModel: NgbDateStruct;
  paymentModel: NgbDateStruct;
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
  allInvestmentType: Array<InvestmentType> = [];
  investmentType: InvestmentType = {amount: null, investmentTypeId: 0, month: null};

  constructor(private layout: LayoutComponent,
              private fb: FormBuilder,
              private nav: iNavigation,
              private http: CoreHttpService
  ) {
  }

  ngOnInit() {
    this.minDate = {year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()};
    let data = this.nav.getValue();
    if (data) {
      this.userId = data.userId;
      this.loadData();
    } else {
      this.layout.stopSkeleton();
      this.initUserForm();
      this.isPageReady = true;
    }
    this.initinventoryForm();
    this.initInvestmentForm();
  }

  loadData() {
    this.isPageReady = false;
    this.http.get(`user/getUserById/${this.userId}`).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.userDetail = res.ResponseBody;
        if (this.userDetail.dob) {
          this.userDetail.dob = ToLocateDate(this.userDetail.dob);
          this.model = { day: this.userDetail.dob.getDate(), month: this.userDetail.dob.getMonth() + 1, year: this.userDetail.dob.getFullYear()};
        }
        this.initUserForm();
        this.isPageReady = true;
        this.layout.stopSkeleton();
      }
    })
  }

  initUserForm() {
    this.userForm = this.fb.group({
      userId: new FormControl(this.userDetail.userId),
      firstName: new FormControl(this.userDetail.firstName, [Validators.required]),
      lastName: new FormControl(this.userDetail.lastName, [Validators.required]),
      mobileNumber: new FormControl(this.userDetail.mobileNumber, [Validators.required]),
      ProfileImgPath: new FormControl(this.userDetail.ProfileImgPath),
      aadharNumber: new FormControl(this.userDetail.aadharNumber, [Validators.required]),
      emailId: new FormControl(this.userDetail.emailId),
      accountId: new FormControl(this.userDetail.accountId),
      dob: new FormControl(this.userDetail.dob),
      address: new FormControl(this.userDetail.address, [Validators.required]),
      referenceBy: new FormControl(this.userDetail.referenceBy, [Validators.required])
    })
  }

  inputToUppercase(event: Event) {
    convertToUppercase(event)
  }

  fireBrowserFile() {
    FireBrowser("uploadocument");
  }

  uploadProfilePicture(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.profileURL = event.target.result;
      };
      let selectedfile = event.target.files;
      let file = <File>selectedfile[0];
      this.imageIndex = new Date().getTime();
      this.isCapturePhoto = false;
      this.fileDetail.push({
        name: `profile_${this.imageIndex}`,
        file: file
      });
    }
  }

  onDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.userForm.controls["dob"].setValue(date);
  }

  get f() {
    return this.userForm.controls;
  }

  saveUser() {
    this.isLoading = true;
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill all the mandatory column");
      return;
    }

    if (this.active == null) {
      this.isLoading = false;
      ErrorToast("Please select product");
      return;
    }

    if (this.active == 4 && this.investmentForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill investment detail");
      return;
    } else if(this.active != 4 && this.inventoryForm.invalid) {
      this.isLoading = false;
      ErrorToast("Please fill Product detail");
      return;
    }

    let value = this.userForm.value;
    value.productType = this.active;
    value.investmentDetail = this.investmentForm.value;
    value.cdProductInvestment = this.inventoryForm.value;

    if (this.active == 4) {
      let lastPaymentDate = new Date(value.investmentDetail.istPaymentDate);
      lastPaymentDate.setMonth(lastPaymentDate.getMonth() + value.investmentDetail.period - 1);
      value.investmentDetail.lastPaymentDate = lastPaymentDate;
    } else {
      let emiEnddate = new Date(value.cdProductInvestment.emiStartDate);
      emiEnddate.setMonth(emiEnddate.getMonth() + value.cdProductInvestment.period);
      value.cdProductInvestment.emiEndDate = emiEnddate;
    }
    
    let formData = new FormData();
    formData.append("user", JSON.stringify(value));
    let file = null;

    if (this.isCapturePhoto) {
      const blob = this.dataURItoBlob(this.profileURL);
      formData.append(`${ProfileImage}`, blob, 'photo.png');
    } else{
      if(this.fileDetail.length > 0)
        file = this.fileDetail[0].file;

      formData.append(`${ProfileImage}`, file);
    }

    let endPoint = "";
    if (this.userDetail.userId > 0)
      endPoint = "user/updateUser";
    else
      endPoint = "user/addNewUser";

    this.http.post(endPoint, formData).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        if (this.active == 4)
          this.bindCustomerInvestmentDetail(res.ResponseBody);
        else
          this.bindCustomerInventoryDetail(res.ResponseBody);

        this.isLoading = false;
        this.isSubmitted = false;
        
      }
    }).catch(e => {
      this.isLoading = false;
      this.isSubmitted = false;
    })
  }

  private bindCustomerInventoryDetail(res: any) {
    let payableAmountToOffice = this.inventoryForm.get("payableAmountToOffice").value;
    this.resetInventoryDetail();
    this.customerInventoryDetail = res.cdProductInvestment;
    this.customerInventoryDetail.accountId = res.accountId;
    this.customerInventoryDetail.firstName = res.firstName;
    this.customerInventoryDetail.lastName = res.lastName;
    this.customerInventoryDetail.payableAmountToOffice = payableAmountToOffice;
    this.customerInventoryDetail.emiStartDate = ToLocateDate(this.customerInventoryDetail.emiStartDate);
    this.customerInventoryDetail.emiEndDate = ToLocateDate(this.customerInventoryDetail.emiEndDate);
    this.customerInventoryDetail.depositDate = ToLocateDate(res.createdOn);
    ShowModal("messageModal");
    setTimeout(() => {
      HideModal("messageModal");
      ShowModal("InventoryCustomerModal")
    }, 2000);
  }

  private bindCustomerInvestmentDetail(res: any) {
    let payableAmountToOffice = this.investmentForm.get("totalPayableAmount").value;
    this.resetInvestmentForm();
    this.customerInvestmentDetail = res.investmentDetail;
    this.customerInvestmentDetail.accountId = res.accountId;
    this.customerInvestmentDetail.firstName = res.firstName;
    this.customerInvestmentDetail.lastName = res.lastName;
    this.customerInvestmentDetail.totalPayableAmount = payableAmountToOffice;
    this.customerInvestmentDetail.principalAmount = this.customerInvestmentDetail.principalAmount * this.customerInvestmentDetail.period;
    this.customerInvestmentDetail.profitAmount = this.customerInvestmentDetail.profitAmount * this.customerInvestmentDetail.period;
    this.customerInvestmentDetail.totalProfitAmount = this.customerInvestmentDetail.totalProfitAmount * this.customerInvestmentDetail.period;
    this.customerInvestmentDetail.istPaymentDate = ToLocateDate(this.customerInvestmentDetail.istPaymentDate);
    this.customerInvestmentDetail.lastPaymentDate = ToLocateDate(this.customerInvestmentDetail.lastPaymentDate);
    this.customerInvestmentDetail.investmentDate = ToLocateDate(this.customerInvestmentDetail.investmentDate);
    ShowModal("messageModal");
    setTimeout(() => {
      HideModal("messageModal");
      ShowModal("InvestmentCustomerModal")
    }, 2000);
  }

  openCamera() {
    this.isCameraOpen = true;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.stream = stream;
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;
      video.play();
    }).catch((err) => {
      console.error("Error accessing camera: ", err);
    });
  }

  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.profileURL = canvas.toDataURL('image/png');
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.isCameraOpen = false;
    }

    this.imageIndex = new Date().getTime();
    this.isCapturePhoto = true;
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/png' });
  }

  selectProductType(e: any) {
    let value = e.target.value;
    if (value) {
      this.active = Number(value);
      this.resetInventoryDetail();
      this.resetInvestmentForm();
      if (this.active == 4) {
        this.isLoading = true;
        this.http.get("investment/getAllInvestmentType").then((res: ResponseModel) => {
          if (res.ResponseBody) {
            this.allInvestmentType = [];
            this.allInvestmentType = res.ResponseBody;
            this.isLoading = false;
          }
        }).catch(e => {
          this.isLoading = false;
        })
      }
    }
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

    this.calculatePaybleOfficeAmount();
  }

  calculatePaybleOfficeAmount() {
    let percentage = Number(this.inventoryForm.get("percentage").value);
    let amount = this.inventoryForm.get("loanAmount").value;
    let payableAmount = (amount * percentage) / 100;
    this.inventoryForm.get("payableAmountToOffice").setValue(payableAmount);
  }

  onEmiDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.inventoryForm.controls["emiStartDate"].setValue(date);
  }

  get n() {
    return this.inventoryForm.controls;
  }

  resetInventoryForm() {
    this.resetInventoryDetail();
    this.isLoading = false;
    this.isSubmitted = false;
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
      istPaymentDate: new FormControl(this.investmentDetail.istPaymentDate, [Validators.required]),
      totalPayableAmount: new FormControl(this.investmentDetail.totalPayableAmount),
      scheme: new FormControl(this.investmentDetail.scheme, [Validators.required]),
      totalProfitAmount: new FormControl(this.investmentDetail.totalProfitAmount, [Validators.required]),
      principalAmount: new FormControl(this.investmentDetail.principalAmount, [Validators.required]),
    })
  }

  get m() {
    return this.investmentForm.controls;
  }

  resetInvestmentForm() {
    this.isLoading = false;
    this.isSubmitted = false;
    this.investmentDetail = {
      paidInstallment: 0,
      investmentId: 0,
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
    this.customerInvestmentDetail = {
      paidInstallment: 0,
      investmentId: 0,
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
    }
    this.initInvestmentForm();
    this.userId = 0;
  }

  selectScheme(e: any) {
    let value = Number(e.target.value);
    this.investmentForm.get("period").setValue(value);
  }

  onPaymentDateSelection(e: NgbDateStruct) {
    let date = new Date(e.year, e.month - 1, e.day);
    this.investmentForm.controls["istPaymentDate"].setValue(date);
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

  closeCustomerInvestmentModal() {
    HideModal("InvestmentCustomerModal");
    this.nav.navigateRoot(User, null);
  }

  closeCustomerInventoryModal() {
    HideModal("InventoryCustomerModal");
    this.nav.navigateRoot(User, null);
  }

  addInvestmentTypePopup() {
    this.investmentType = {amount: null, investmentTypeId: 0, month: null};
    ShowModal("addInvestmentTypeModal");
  }

  addInvestmentSchemen() {
    if (this.investmentType.amount > 0 && this.investmentType.month > 0) {
      this.isLoading = true;
      this.http.post("investment/addInvestmentType", this.investmentType).then((res:ResponseModel) => {
        if (res.ResponseBody) {
          this.allInvestmentType = [];
          this.allInvestmentType = res.ResponseBody;
          HideModal("addInvestmentTypeModal");
          this.isLoading = false;
        }
      }).catch (e => {
        this.isLoading = false;
      })
    } else {
      ErrorToast("Please add investment amount and month");
    }
  }
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  ProfileImgPath: string;
  aadharNumber: string;
  emailId: string;
  accountId: string;
  dob: Date;
  address: string;
  referenceBy: string;
  productType: number;
}

export interface Inventory {
  cdProductId: number;
  productName: string;
  emiAmount: number;
  finalPrice: number;
  period: number;
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
  percentage: number;
  createdOn?: Date;
}

export interface Investment {
  investmentId: number;
  investmentAmount: number;
  addOn: number;
  principalAmount: number;
  profitAmount: number;
  period: number;
  totalProfitAmount: number;
  totalPayableAmount: number;
  istPaymentDate: Date;
  lastPaymentDate: Date;
  investmentDate: Date;
  scheme: number;
  paidInstallment: number;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  total?: number;
}

interface InvestmentType {
  investmentTypeId: number;
  amount: number,
  month: number;
}