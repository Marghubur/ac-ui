import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '../constants';
import { map, Observable } from 'rxjs';
import { JwtService, ResponseModel } from '../../auth/jwtService';
import { environment } from '../../environments/environment';

@Injectable()
export class AjaxService {
  IsTokenByPass: boolean = true;
  private serviceName: string = "";

  constructor(protected tokenHelper: JwtService, protected http: HttpClient, protected ServiceName: string) {
    this.serviceName = ServiceName;
    if (environment.production) {
      console.log(`[Bottomhalf]: BiPortal Running on ${environment.env}`);
    } else {
      console.log('[Bottomhalf]: BiPortal Running on localhost');
    }
  }

  public GetImageBasePath() {
    let ImageBaseUrl = environment.baseUrl.replace('/api', '/Files');
    ImageBaseUrl = ImageBaseUrl + 'Files/';
    return ImageBaseUrl;
  }

  async login(Url: string, Param: any): Promise<ResponseModel> {
    this.tokenHelper.setCompanyCode(Param.CompanyCode);
    return new Promise((resolve, reject) => {
      this.http
        .post(this.getServiceUrl(Url), Param, {
          observe: 'response',
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (this.tokenHelper.IsValidResponse(res.body)) {
                let loginData: ResponseModel = res.body;
                if (this.tokenHelper.setLoginDetail(loginData.ResponseBody)) {
                  resolve(res.body);
                } else {
                  resolve(null);
                }
              } else {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            0;
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async get(Url: string): Promise<ResponseModel> {
    return new Promise((resolve, reject) => {
      return this.http
        .get(this.getServiceUrl(Url), {
          observe: 'response',
        })
        .subscribe({
          next: (res: any) => {
            if (this.tokenHelper.IsValidResponse(res.body)) {
              resolve(res.body);
            } else {
              resolve(null);
            }
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async post(Url: string, Param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.getServiceUrl(Url), Param, {
          observe: 'response',
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(null);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async put(Url: string, Param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .put(this.getServiceUrl(Url), Param, {
          observe: 'response',
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async delete(
    Url: string,
    Param?: any,
    ServiceName: SERVICE = SERVICE.AUTH
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.getServiceUrl(Url), {
          headers: {
            observe: 'response',
          },
          body: Param,
        })
        .subscribe({
          next: (res: any) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async upload(
    Url: string,
    Param: any,
    ServiceName: SERVICE = SERVICE.AUTH
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.getServiceUrl(Url), Param, {
          observe: 'response',
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          },
        });
    });
  }

  async forgotPassword(Url: string, Param: any): Promise<ResponseModel> {
    this.tokenHelper.setCompanyCode(Param.CompanyCode);
    return this.post(Url, Param);
  }

  async postService(Url: string, Param: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.getServiceUrl(Url), Param, {
          observe: 'response',
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            reject(e.error);
          },
        });
    });
  }

  getServiceUrl(Url: string, isLocalServerFlag: boolean = false): string {
    // let BaseUrlPath = `${environment.baseUrl}/api`;
    let BaseUrlPath = `https://www.axilcorps.com/api`;

    switch(this.serviceName) {
      case SERVICE.AUTH:
        return `${BaseUrlPath}/${SERVICE.AUTH}/${Url}`;
      case SERVICE.CORE:
        return `${BaseUrlPath}/${SERVICE.CORE}/${Url}`;
      default:
        throw "Not found";
    }
  }

  downloadExcel(Url: string, data: any): Observable<Blob> {
    return this.http.post(this.getServiceUrl(Url), data, { responseType: 'blob' }).pipe(
      map((res: Blob) => {
        return res;
      })
    )
  }
}

export interface iconConfig {
  iconName: string;
  fn?: Function;
}
