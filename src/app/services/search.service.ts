import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public flightsByCity: any;
  public flightsByNo: any;
  public flightsByAll: any;

  constructor(private http: HttpClient) { }

  search (url: string, ports: any) {
    return this.http.get(url, {params: ports})
  }
}
