import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CallBackendService {
  constructor(private httpClient: HttpClient) {}
  backendDomain: string = 'http://localhost:3000';
  getSearchResults(
    key: string,
    lat: string,
    lng: string,
    address: string,
    distance: string,
    category: string
  ): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>(
      `${this.backendDomain}/search?key=${key}&lat=${lat}&lng=${lng}&address=${address}&distance=${distance}&category=${category}`
    );
  }
  getDetail(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.backendDomain}/search/${id}`);
  }
  getReview(id: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.backendDomain}/search/${id}/reviews`
    );
  }
}
