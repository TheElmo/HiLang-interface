import { Injectable } from '@angular/core';
import { HilangApiService } from './hilang-api.service';

@Injectable()
export class LoginService {
  private course: object;

  constructor(private _api: HilangApiService) { }
    postLoginData(loginData) {
        return this._api.login(loginData);
    }
}
