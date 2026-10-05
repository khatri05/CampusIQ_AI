import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

  constructor(
    private router: Router
  ) {}

  goBack(): void {
    window.history.back();
  }

  goDashboard(): void {

    const currentUrl =
      this.router.url;

    if (currentUrl.startsWith('/student')) {
      this.router.navigate([
        '/student/dashboard'
      ]);
      return;
    }

    if (currentUrl.startsWith('/faculty')) {
      this.router.navigate([
        '/faculty/dashboard'
      ]);
      return;
    }

    if (
      currentUrl.startsWith(
        '/placement-officer'
      )
    ) {
      this.router.navigate([
        '/placement-officer/dashboard'
      ]);
      return;
    }

    if (currentUrl.startsWith('/admin')) {
      this.router.navigate([
        '/admin/dashboard'
      ]);
      return;
    }

    this.router.navigate(['/login']);
  }
}