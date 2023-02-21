import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent implements OnInit {
  database: any = [];
  index = 0;
  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < localStorage.length; i++) {
      let id: string | null = localStorage.key(i);
      if (typeof id == 'string') {
        let data: string | null = localStorage.getItem(id);
        if (typeof data == 'string') {
          this.database.push([id, JSON.parse(data)]);
        }
      }
      // console.log(this.database[i][1][0]); //object
      // console.log(this.database[i][0]); //id
    }
  }
  cancelReservation(id: string) {
    if (localStorage.getItem(id)) {
      localStorage.removeItem(id);
      this.database = [];
      for (let i = 0; i < localStorage.length; i++) {
        let id: string | null = localStorage.key(i);
        if (typeof id == 'string') {
          let data: string | null = localStorage.getItem(id);
          if (typeof data == 'string') {
            this.database.push([id, JSON.parse(data)]);
          }
        }
      }
    }

    alert('Reservation cancelled!');
  }
}
