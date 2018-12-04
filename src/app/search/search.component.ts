import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

import { StartupService } from '../startup.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  sourceControl = new FormControl();
  destinationControl = new FormControl();
  flightsControl = new FormControl();
  sourceArr: Array<string>;
  destinationArr: Array<string>;
  flights: Array<string>;
  filteredSources: Observable<string[]>;
  filteredDestinations: Observable<string[]>;
  filteredFlights: Observable<string[]>;
  constructor(public startup: StartupService) { }

  ngOnInit() {
    
    async function delay(time: number) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    (async () => {
      await delay(2000);

      this.filteredSources = this.sourceControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.sourceFilter(value))
      );

      this.filteredDestinations = this.destinationControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this.destinationFilter(value))
        );

      this.filteredFlights = this.flightsControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this.flightsFilter(value))
        );
    })();
  }

  private sourceFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.sourceArr = this.startup.preFillData.origins;
    return this.sourceArr.filter(option => option.toLowerCase().includes(filterValue));
  }
  private destinationFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.destinationArr = this.startup.preFillData.destinations;
    return this.destinationArr.filter(option => option.toLowerCase().includes(filterValue));
  }
  private flightsFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.flights = this.startup.preFillData.flights;
    return this.flights.filter(option => option.toLowerCase().includes(filterValue));
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

}
