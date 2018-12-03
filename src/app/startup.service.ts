import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  private _startupData: any;

  constructor(private http: HttpClient) { }

  load() {

    this._startupData = null;

    return this.http
        .get('/api')
        .subscribe((data: any) => this._startupData = data);
  }

  get startupData(): any {
      return this._startupData;
  }
}
