import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../features/placement-officer/components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../../features/placement-officer/components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-placement-officer-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopNavbarComponent
  ],
  templateUrl: './placement-officer-dashboard.component.html',
  styleUrl: './placement-officer-dashboard.component.css'
})
export class PlacementOfficerDashboardComponent {

  notificationCount = 0;

  onSearch(searchText: string): void {
    console.log('Placement Officer Search:', searchText);
  }
}