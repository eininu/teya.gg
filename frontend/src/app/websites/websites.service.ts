import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Website } from './website.interface';
@Injectable({
  providedIn: 'root',
})
export class WebsitesService {
  constructor(private http: HttpClient) {}

  test(): string {
    return 'WebsitesService test called';
  }

  getSomeData() {
    return this.http.get<Website[]>('/api/websites');
  }
}
