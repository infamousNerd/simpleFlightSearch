import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  public _preFillData: any;

  constructor(private http: HttpClient) { }

  public load() {
    return this.http.get('/api').subscribe(loadDoc => {
      this._preFillData = loadDoc
    });
  }

  get preFillData(): any {
      return this._preFillData;
  }
}
