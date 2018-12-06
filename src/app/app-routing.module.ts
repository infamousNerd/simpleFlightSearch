import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: 'results',
    component: ResultsComponent
  },
  {
    path: 'details',
    component: DetailsComponent
  } 
];

const config: ExtraOptions = {
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
