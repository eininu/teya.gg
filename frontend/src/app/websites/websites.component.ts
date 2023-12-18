import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsitesService } from './websites.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';
@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './websites.component.html',
  styleUrl: './websites.component.css',
  providers: [WebsitesService],
})
export class WebsitesComponent implements OnInit {
  websitesData: any = [];

  constructor(private webSitesService: WebsitesService) {
    // console.log('WebsitesComponent constructor called');
    console.log(webSitesService.test());
    const observable2 = webSitesService.getSomeData();

    observable2.pipe(map((data) => data)).subscribe((parsedData) => {
      this.websitesData = parsedData;
      console.log(parsedData);
    });
  }

  ngOnInit() {
    // console.log('WebsitesComponent ngOnInit called');
  }
}
