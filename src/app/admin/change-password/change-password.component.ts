import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResponseModel } from '../../../auth/jwtService';
import { AuthHttpService } from '../../../providers/AjaxServices/auth-http.service';
import { Toast, ErrorToast } from '../../../providers/common-service/common.service';
import { iNavigation } from '../../../providers/iNavigation';
import { UserService } from '../../../providers/userService';
import { LayoutComponent } from '../../layout/layout/layout.component';
import { confirmPasswordValidator } from '../../util/confirmedpassword.validator';
import { BreadcrumsComponent } from '../../util/breadcrums/breadcrums.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [BreadcrumsComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  isLogOut: boolean = false;
  isPasswordChanged: boolean = false;
  userDetail: any = null;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder,
              private http: AuthHttpService,
              private user: UserService,
              private nav: iNavigation,
              private layout: LayoutComponent) { }

  ngOnInit(): void {
    this.userDetail = this.user.getInstance();
    this.initForm();
    this.layout.stopSkeleton();
  }

  initForm() {
    this.resetPasswordForm = this.fb.group({
      oldPassword: new FormControl ('', [Validators.required]),
      newPassword: new FormControl ('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$")]),
      confirmPassword: new FormControl ('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,20}$")])
    }, {
      validator: confirmPasswordValidator('newPassword', 'confirmPassword')
    })
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    this.isPasswordChanged = false;
    if (this.resetPasswordForm.invalid) {
      this.isLoading = false;
      return;
    }

    let password = {
      password: this.resetPasswordForm.controls['oldPassword'].value,
      newPassword: this.resetPasswordForm.controls['newPassword'].value,
      emailId: this.userDetail.emailId,
      mobile: this.userDetail.mobileNumber,
      employeeId: this.userDetail.userId
    }
    this.http.post("changePassword", password)
    .then((response:ResponseModel) => {
      if (response.ResponseBody) {
        Toast(response.ResponseBody);
        this.onReset();
        this.isPasswordChanged = true;
      } else {
        ErrorToast("Unable to update your password");
      }
      this.isLoading = false;
    }).catch(e => {
      this.isLoading = false;
    })
  }

  get f () {
    return this.resetPasswordForm.controls;
  }

  LogoutUser() {
    this.isLogOut = true
    this.nav.logout();
    Toast("Log out successfully");
    this.isLogOut = false;
    this.isPasswordChanged = false;
    this.nav.navigate("/", null);
  }

  onReset() {
    this.resetPasswordForm.reset();
    this.submitted = false;
    this.isLoading = false;
    this.isPasswordChanged = false;
  }

  showPassword(e: any) {
    e.currentTarget.previousElementSibling.previousElementSibling.removeAttribute("type");
    e.currentTarget.previousElementSibling.previousElementSibling.setAttribute("type", "text");
    e.currentTarget.previousElementSibling.classList.remove("d-none");
    e.target.parentElement.classList.add("d-none");
  }

  hidePassword(e: any) {
    e.currentTarget.previousElementSibling.removeAttribute("type");
    e.currentTarget.previousElementSibling.setAttribute("type", "password");
    e.currentTarget.nextElementSibling.classList.remove("d-none")
    e.target.parentElement.classList.add("d-none");
  }
}
