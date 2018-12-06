import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PassService {

  private flight: Object = {};

  constructor(private route: Router) { }

  setData(data: Object){
    Object.assign(this.flight, data);
  }

  getData(){
    let tempFlight = this.flight;
    this.clearData();
    return tempFlight;
  }

  clearData(){
    this.flight = {};
  }
}
