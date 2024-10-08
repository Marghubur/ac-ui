import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AccessToken,
  AccessTokenExpiredOn,
  BadRequest,
  Forbidden,
  Login,
  Master,
  NotFound,
  ServerError,
  ServerNotAvailable,
  String,
  Success,
  UnAuthorize } from '../providers/constants';
import { iNavigation } from '../providers/iNavigation';
import { ErrorToast } from '../providers/common-service/common.service';

@Injectable()
export class JwtService {
  constructor(private nav: iNavigation) {}

  private companyCode: string = null;

  getJwtToken() {
    let Token = localStorage.getItem(AccessToken);
    return Token;
  }

  setJwtToken(token: string, expiredOn: string) {
    localStorage.setItem(AccessTokenExpiredOn, expiredOn);
    if (token !== null && token !== '') {
      localStorage.setItem(AccessToken, token);
    }
  }

  setLoginDetail(data: any): Boolean {
    let res: LoginResponse = data as LoginResponse;
    let flag: Boolean = false;
    if (res !== undefined && res !== null) {
      // if (
      //   res.Menu !== null &&
      //   res.ReportColumnMapping !== null &&
      //   res.UserDetail !== null
      // ) {
      //   this.removeJwtToken();
      //   this.setJwtToken(
      //     res.UserDetail['Token'],
      //     res.UserDetail['TokenExpiryDuration']
      //   );
      //   localStorage.setItem(Master, JSON.stringify(res));
      //   flag = true;
      // }
      if (
        res.UserDetail !== null
      ) {
        this.removeJwtToken();
        this.setJwtToken(
          res.UserDetail['token'],
          res.UserDetail['tokenExpiryDuration']
        );
        localStorage.setItem(Master, JSON.stringify(res));
        flag = true;
      }
    }
    return flag;
  }

  removeJwtToken() {
    localStorage.removeItem(AccessToken);
    localStorage.removeItem(AccessTokenExpiredOn);
    localStorage.removeItem(Master);
  }

  setCompanyCode(code: string) {
    this.companyCode = code;
  }

  getCompanyCode() {
    return this.companyCode;
  }

  IsValidResponse(response: ResponseModel) {
    let flag = true;
    if (!response || response.HttpStatusCode != Success) {
      let e: HttpErrorResponse = {
        error: null,
        headers: null,
        status: response.HttpStatusCode,
        statusText: null,
        url: null,
        message: null,
        name: null,
        ok: null,
        type: null,
      };

      this.HandleResponseStatus(e);
      flag = false;
    }

    return flag;
  }

  HandleResponseStatus(e: HttpErrorResponse): boolean {
    let flag = false;
    let error: ResponseModel = e.error;
    switch (e.status) {
      case Success:
        flag = true;
        break;
      case UnAuthorize:
        let token = localStorage.getItem('access_token');
        if (token !== null && token != '')
          document
            .getElementById('sessionexpiredBox')
            .classList.remove('d-none');
        else localStorage.clear();
        ErrorToast('Unauthorized access. Please login again.');
        this.nav.navigate(Login, null);
        break;
      case NotFound:
        ErrorToast('Page not found. Please check your Url.');
        break;
      case Forbidden:
        ErrorToast('Invalid user access. Please try login again.');
        this.nav.navigate(Login, null);
        break;
      case ServerError:
      case BadRequest:
        if (error.ResponseBody == undefined) {
          ErrorToast('Internal servel error. Please contact to admin');
        } else {
          if (typeof error.ResponseBody == String) {
            ErrorToast(error.ResponseBody);
          } else {
            if (
              error.ResponseBody.UserMessage != undefined &&
              error.ResponseBody.UserMessage != null &&
              error.ResponseBody.UserMessage != ''
            ) {
              ErrorToast(error.ResponseBody.UserMessage);
            } else if (
              error.ResponseBody.ExceptionMessage != undefined &&
              error.ResponseBody.ExceptionMessage != null &&
              error.ResponseBody.ExceptionMessage != ''
            ) {
              ErrorToast(error.ResponseBody.ExceptionMessage);
            } else {
              break;
            }
          }
        }
        break;
      case ServerNotAvailable:
        ErrorToast(
          'Requested service is not available. Please re-try after some time.'
        );
      default:
        ErrorToast('Unknown error occured. Please contact to admin.');
        break;
    }

    return flag;
  }
}

export interface ResponseModel {
  AuthenticationToken: string;
  HttpStatusCode: number;
  HttpStatusMessage: string;
  ResponseBody: any;
}

export class LoginResponse {
  Menu: any = null;
  ReportColumnMapping: any = null;
  UserDetail: any = null;
}
