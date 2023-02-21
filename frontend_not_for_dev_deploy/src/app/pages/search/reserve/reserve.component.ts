import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent implements OnInit {
  database = localStorage;
  EMAIL_PATTERN: RegExp =
    /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  email: string = '';
  isEmailValid: boolean = true;
  date: string = '';
  hour: string = '';
  minute: string = '';
  @Input() modalName: string = '';
  @Input() id: string = '';
  @ViewChild('close') close: ElementRef | undefined;
  constructor() {}

  ngOnInit(): void {
    this.database = localStorage;
  }
  setHour(s: string): void {
    this.hour = s;
  }
  setMinute(s: string): void {
    this.minute = s;
  }
  getToday(): string {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }
  validate(p: RegExp) {
    if (p.test(this.email)) {
      this.isEmailValid = true;
    } else {
      this.isEmailValid = false;
    }
  }
  onSubmit(event: { preventDefault: () => void; stopPropagation: () => void }) {
    let form = document.getElementsByClassName(
      'needs-validation'
    )[0] as HTMLFormElement;
    if (form.checkValidity() === false || this.isEmailValid === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
    if (
      this.email == '' ||
      this.date == '' ||
      this.hour == '' ||
      this.minute == '' ||
      this.isEmailValid === false
    ) {
      return;
    } else {
      /*** */
      let bookings = [
        {
          business_name: this.modalName,
          date: this.date,
          time: `${this.hour}:${this.minute}`,
          email: this.email,
        },
      ];
      localStorage.setItem(this.id, JSON.stringify(bookings));
      this.database = localStorage;
      console.log(localStorage.getItem(this.id));
      setTimeout(() => {
        this.close?.nativeElement.click();
      }, 200);
      alert('Reservation Created!');
    }
  }
  clearForm() {
    this.email = '';
    this.date = '';
    this.hour = '';
    this.minute = '';
  }
}
