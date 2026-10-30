import {
  Component
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  SidebarComponent
} from '../../features/admin/components/sidebar/sidebar.component';

import {
  TopNavbarComponent
} from '../../features/admin/components/top-navbar/top-navbar.component';


@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    RouterOutlet,
    SidebarComponent,
    TopNavbarComponent
  ],

  templateUrl:
    './admin-dashboard.component.html',

  styleUrl:
    './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  notificationCount = 0;


  onSearch(
    searchText: string
  ): void {

    console.log(
      'Admin Search:',
      searchText
    );

  }


  onNotificationClick(): void {

    console.log(
      'Admin Notifications'
    );

  }

}