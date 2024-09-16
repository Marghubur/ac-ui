import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { SERVICE } from '../constants';
import { JwtService } from '../../auth/jwtService';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService extends AjaxService {

    constructor(tokenHelper: JwtService, http: HttpClient) {
        super(tokenHelper, http, SERVICE.AUTH);
     }

}
