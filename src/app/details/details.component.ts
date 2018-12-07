import { Component, OnInit } from '@angular/core';
import { PassService } from '../services/pass.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private flight: Object;
  private props: number;

  constructor(private pass: PassService) { }

  ngOnInit() {
    this.flight = this.pass.getData();
    this.props = Object.keys(this.flight).length;
  }

}
