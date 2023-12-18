import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsitesService {
  constructor(private http: HttpClient) {}

  test(): string {
    return 'WebsitesService test called';
  }

  getSomeData() {
    return this.http.get('/api/websites');
  }
}
