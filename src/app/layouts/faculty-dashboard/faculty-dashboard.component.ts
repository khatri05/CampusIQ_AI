import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../features/faculty/components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../../features/faculty/components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopNavbarComponent
  ],
  templateUrl: './faculty-dashboard.component.html',
  styleUrl: './faculty-dashboard.component.css'
})
export class FacultyDashboardComponent {

  notificationCount = 0;
  onSearch(searchText: string): void {
    console.log('Search:', searchText);
  }

}