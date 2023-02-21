import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class IpinfoService {
  constructor(private httpClient: HttpClient) {}
  getGeolocation(): Observable<any> {
    return this.httpClient.get<any>(
      `https://ipinfo.io/json?token=1f32afdd229fc2`
    );
  }
}
