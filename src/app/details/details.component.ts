import { Component, OnInit } from '@angular/core';
import { PassService } from '../pass.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private flight: Object;

  constructor(private pass: PassService) { }

  ngOnInit() {
    this.flight = this.pass.getData();
  }

}
