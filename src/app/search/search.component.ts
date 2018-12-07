import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { StartupService } from '../services/startup.service';

import { equalityValidator } from  '../validations/equality-validation.directive';
import { invalidSelection } from '../validations/invalid-selection.directive';
import { invalidSearch } from '../validations/invalid-search.directive';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  sourceArr: Array<string> = this.startup.preFillData.origins;
  destinationArr: Array<string> = this.startup.preFillData.destinations;
  flights: Array<string> = this.startup.preFillData.flights;
  searchFlights =  new FormGroup({
    sourceControl: new FormControl(null, [invalidSelection(this.startup.preFillData.origins)]),
    destinationControl: new FormControl(null, [invalidSelection(this.startup.preFillData.destinations)]),
    flightsControl: new FormControl(null, [invalidSelection(this.startup.preFillData.flights)]),
    dateControl: new FormControl(new Date(), [ Validators.required ])
  }, { validators: [equalityValidator, invalidSearch]} /*updateOn: 'blur'*/);
  model: any = {};
  filteredSources: Observable<string[]>;
  filteredDestinations: Observable<string[]>;
  filteredFlights: Observable<string[]>;
  constructor(private startup: StartupService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.filteredSources = this.searchFlights.controls.sourceControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.sourceFilter(value))
      );

    this.filteredDestinations = this.searchFlights.controls.destinationControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.destinationFilter(value))
      );

    this.filteredFlights = this.searchFlights.controls.flightsControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.flightsFilter(value))
      );
  }

  search () {
    const values = this.searchFlights.value;
    const textifiedDate =  JSON.stringify(values.dateControl).replace('"', '').split("T")[0];
    const requestObj = {
      origin: values.sourceControl,
      destination: values.destinationControl,
      flight: values.flightsControl,
      date: textifiedDate
    };
    
    return this.router.navigate(['/results'], { queryParams: requestObj, relativeTo: this.route, skipLocationChange: true });
  }

  private sourceFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.sourceArr.filter(option => option.toLowerCase().includes(filterValue));
  }
  private destinationFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.destinationArr.filter(option => option.toLowerCase().includes(filterValue));
  }
  private flightsFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.flights.filter(option => option.toLowerCase().includes(filterValue));
  }

}
