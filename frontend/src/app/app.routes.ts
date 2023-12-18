import { Routes } from '@angular/router';
import { WebsitesComponent } from './websites/websites.component';
export const routes: Routes = [
  { path: 'websites', component: WebsitesComponent },
  { path: '', redirectTo: '/websites', pathMatch: 'full' },
];
