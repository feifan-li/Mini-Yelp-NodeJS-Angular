import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { IpinfoService } from 'src/app/services/ipinfo.service';
import { CallBackendService } from 'src/app/services/call-backend.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  myCtrl = new FormControl();
  database = localStorage;
  filteredKeywords: Array<string> | any;
  isLoading = false;
  hasResults: boolean = true;
  keyword: string = '';
  distance: number | undefined;
  location: string = '';
  category: string = 'default';
  checkbox: boolean = false;
  info: string = ''; //lat = info.split(',')[0];lng = info.split(',')[1]
  searchResults: Array<any> | any;
  businessDetails: any = undefined;
  tweetShareLink: string = ``;
  facebookShareLink: string = ``;
  reviewsDetails: any = undefined;
  mapOptions: google.maps.MapOptions = {
    center: undefined,
    zoom: 14,
  };
  marker: any = {
    position: undefined,
  };
  ipinfoSubscription: Subscription | any;
  callBackendSubscription: Subscription | any;
  constructor(
    private http: HttpClient,
    private ipinfoService: IpinfoService,
    private callBackendService: CallBackendService
  ) {}

  ngOnInit() {
    this.database = localStorage;
    this.myCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null;
        }),
        distinctUntilChanged(),
        // debounceTime(200),
        tap(() => {
          this.filteredKeywords = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.http
            .get(`http://localhost:3000/search/autocomplete?text=${value}`)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((data: any) => {
        if (data == undefined) {
          this.filteredKeywords = [];
        } else {
          this.filteredKeywords = data;
        }
        console.log(this.filteredKeywords);
      });
  }
  getGeolocationByIpinfo() {
    if (this.checkbox == false) {
      this.location = '';
      // call ipinfo api
      this.ipinfoSubscription = this.ipinfoService
        .getGeolocation()
        .subscribe((_info) => {
          this.info = _info.loc;
          console.log(this.info.split(',')[0]);
          console.log(this.info.split(',')[1]);
        });
    }
  }
  clearForm() {
    this.keyword = '';
    this.distance = undefined;
    this.location = '';
    this.category = 'default';
    this.checkbox = false;
    this.hasResults = true;
    this.searchResults = undefined;
    this.businessDetails = undefined;
    this.reviewsDetails = undefined;
  }
  onSubmit() {
    if (
      this.keyword == '' ||
      this.category == '' ||
      (this.location == '' && !this.checkbox)
    ) {
      return;
    }
    let d = this.distance;
    if (d == undefined || d.toString() == '') {
      d = 10;
    }
    this.hasResults = true;
    this.searchResults = undefined;
    this.businessDetails = undefined;
    this.reviewsDetails = undefined;
    if (this.location != '') {
      let index = 0;
      this.info = '';
      this.callBackendSubscription = this.callBackendService
        .getSearchResults(
          this.keyword.replace(/\s/g, '-'),
          '',
          '',
          this.location.replace(/\s/g, '-'),
          d.toString(),
          this.category.replace(/\s/g, '-')
        )
        .subscribe((_searchResults) => {
          this.searchResults = Object.entries(_searchResults);
          this.hasResults =
            !this.searchResults || this.searchResults.length == 0
              ? false
              : true;
          console.log(this.searchResults);
        });
    } else {
      let index = 0;
      this.callBackendSubscription = this.callBackendService
        .getSearchResults(
          this.keyword.replace(/\s/g, '-'),
          this.info.split(',')[0],
          this.info.split(',')[1],
          this.location.replace(/\s/g, '-'),
          d.toString(),
          this.category.replace(/\s/g, '-')
        )
        .subscribe((_searchResults) => {
          this.searchResults = Object.entries(_searchResults);
          this.hasResults =
            !this.searchResults || this.searchResults.length == 0
              ? false
              : true;
          console.log(this.searchResults);
        });
    }
  }
  onTableRow(id: string) {
    this.callBackendSubscription = this.callBackendService
      .getDetail(id)
      .subscribe((_detail) => {
        this.businessDetails = _detail;
        if (this.businessDetails) {
          this.mapOptions.center = {
            lat: this.businessDetails.coordinates.latitude,
            lng: this.businessDetails.coordinates.longitude,
          };
          this.marker.position = {
            lat: this.businessDetails.coordinates.latitude,
            lng: this.businessDetails.coordinates.longitude,
          };
          this.tweetShareLink =
            `https://twitter.com/intent/tweet?text=Check ` +
            `${this.businessDetails.name} on Yelp.` +
            `&url=${this.businessDetails.url}`;
          this.facebookShareLink =
            `https://www.facebook.com/sharer/sharer.php?u=` +
            `${this.businessDetails.url}`;
          this.callBackendSubscription = this.callBackendService
            .getReview(this.businessDetails.id)
            .subscribe((_reviews) => {
              this.reviewsDetails = _reviews;
              console.log(this.businessDetails);
              console.log(this.reviewsDetails);
            });
        }
      });
  }
  cancelReservation(id: string) {
    if (localStorage.getItem(id)) {
      localStorage.removeItem(id);
    }
    this.database = localStorage;
    alert('Reservation cancelled!');
  }
  ngOnDestroy(): void {
    if (this.ipinfoSubscription) {
      this.ipinfoSubscription.unsubscribe();
    }
  }
}
