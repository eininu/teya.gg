import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsitesService } from './websites.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs';
import * as punycode from 'punycode';
import { Website } from './website.interface';

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

    observable2;
    observable2
      .pipe(
        map((data: Website[]) =>
          data.map((item) => {
            if (item.domainName.startsWith('xn--')) {
              try {
                // Декодируем имя домена с использованием punycode
                item.domainName = punycode.toUnicode(item.domainName);
              } catch (e) {
                console.error(`Error decoding ${item.domainName}: ${e}`);
              }
            }
            return item;
          }),
        ),
      )
      .subscribe(
        (parsedData: Website[]) => {
          this.websitesData = parsedData;
        },
        (error) => {
          console.error('Error fetching data: ', error);
        },
      );
  }

  ngOnInit() {
    // console.log('WebsitesComponent ngOnInit called');
  }
}
