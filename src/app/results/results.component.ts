import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { PassService } from '../pass.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  
  flights: Array<{}>;
  category: string;
  length: number;

  constructor(private searcher: SearchService, private route: ActivatedRoute, private router: Router, private pass: PassService) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.pipe(debounceTime(500)).subscribe(params => {
      const byCity = !params.flight;
      const byFlight = !params.origin && !params.destination
      if (byCity) {
        const url = '/api/searchByCity'
        const query = new HttpParams().set("origin", params.origin).set("destination", params.destination).set("date", params.date);
        return this.searcher.search(url, query).subscribe(
          (flightsDoc: Array<{}>) => {
            this.flights = flightsDoc;
            this.category = "Origin and Destination";
            this.length = flightsDoc.length;
          }
        ),
        catchError(err => throwError(new Error('Unable to get the flight details:' + '' + err)));;
      } else if (byFlight) {
        const url = '/api/searchByFlight'
        const query = new HttpParams().set("flightNumber", params.flight).set("date", params.date);
        return this.searcher.search(url, query).subscribe(
          (flightsDoc: Array<{}>) => {
            this.flights = flightsDoc;
            this.category = "Flight Number";
            this.length = flightsDoc.length;
          }
        ),
        catchError(err => throwError(new Error('Unable to get the flight details:' + '' + err)));;;
      } else {
        const url = '/api/searchByAll'
        const query = new HttpParams().set("origin", params.origin).set("destination", params.destination).set("date", params.date).set("flightNumber", params.flight);
        return this.searcher.search(url, query).subscribe(
          (flightsDoc: Array<{}>) => {
            this.flights = flightsDoc;
            this.category = "All selectable criteria";
            this.length = flightsDoc.length;
          }
        ),
        catchError(err => throwError(new Error('Unable to get the flight details:' + '' + err)));;;
      }
    });
  }

  passFlight(data: Object) {
    this.pass.setData(data);
    this.router.navigateByUrl('/details', { relativeTo: this.route });
  }
}
