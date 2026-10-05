import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../features/student/components/sidebar/sidebar.component';
import { TopNavbarComponent } from '../../features/student/components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopNavbarComponent
  ],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {}