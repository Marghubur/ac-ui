import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { convertToUppercase, ErrorToast, FireBrowser, Toast, ToLocateDate } from '../../../providers/common-service/common.service';
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
    alternateNumber: null,
    dob: null,
    emailId: null,
    firstName: null,
    lastName: null,
    mobileNumber: null,
    ProfileImgPath: null,
    referenceId: 0,
    userId: 0
  };
  isLoading: boolean = false;
  isPageReady: boolean = false;
  private userId: number = 0;
  isCameraOpen = false;
  stream: MediaStream | null = null;
  private isCapturePhoto: boolean = false;
  @ViewChild('videoElement') videoElement!: ElementRef;

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
  }

  loadData() {
    this.isPageReady = false;
    this.http.get(`user/getUserById/${this.userId}`).then((res: ResponseModel) => {
      if (res.ResponseBody) {
        this.userDetail = res.ResponseBody;
        this.userDetail.dob = ToLocateDate(this.userDetail.dob);
        this.model = { day: this.userDetail.dob.getDate(), month: this.userDetail.dob.getMonth() + 1, year: this.userDetail.dob.getFullYear()};
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
      alternateNumber: new FormControl(this.userDetail.alternateNumber),
      emailId: new FormControl(this.userDetail.emailId),
      accountId: new FormControl(this.userDetail.accountId),
      dob: new FormControl(this.userDetail.dob, [Validators.required]),
      address: new FormControl(this.userDetail.address, [Validators.required])
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

    console.log(this.userForm.value);
    let formData = new FormData();
    formData.append("user", JSON.stringify(this.userForm.value));
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
        Toast(res.ResponseBody);
        this.isLoading = false;
        this.isSubmitted = false;
        this.nav.navigateRoot(User, null);
      }
    }).catch(e => {
      this.isLoading = false;
      this.isSubmitted = false;
    })
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
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  ProfileImgPath: string;
  alternateNumber: string;
  emailId: string;
  accountId: string;
  dob: Date;
  address: string;
  referenceId: number;
}
