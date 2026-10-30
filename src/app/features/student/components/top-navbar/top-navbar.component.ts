import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';


@Component({
  selector: 'app-top-navbar',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl:
    './top-navbar.component.html',

  styleUrl:
    './top-navbar.component.css'
})
export class TopNavbarComponent {

  @Input()
  studentName = 'Student';


  @Input()
  studentRole = 'Student';


  @Input()
  initials = 'ST';


  @Input()
  notificationCount = 0;


  @Output()
  searchChange =
    new EventEmitter<string>();


  @Output()
  notificationClick =
    new EventEmitter<void>();


  searchText = '';


  onSearch(): void {

    this.searchChange.emit(
      this.searchText
    );

  }


  openNotifications(): void {

    this.notificationClick.emit();

  }

}