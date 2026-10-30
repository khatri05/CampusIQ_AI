import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  PlacementNotification,
  PlacementOfficerNotificationsService
} from '../../../core/services/placement-officer-notifications.service';


@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './notifications.component.html',

  styleUrl:
    './notifications.component.css'
})
export class NotificationsComponent
  implements OnInit {


  notifications:
    PlacementNotification[] = [];


  filteredNotifications:
    PlacementNotification[] = [];


  activeFilter:
    'all' |
    'unread' |
    'read' = 'all';


  loading = true;

  errorMessage = '';

  successMessage = '';


  constructor(
    private notificationsService:
      PlacementOfficerNotificationsService
  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  async loadNotifications(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';


    try {

      this.notifications =
        await this.notificationsService
          .getNotifications();


      this.applyFilter();


    } catch (error: any) {

      console.error(
        'Notifications loading error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to load notifications';


    } finally {

      this.loading = false;

    }

  }


  applyFilter(): void {

    if (
      this.activeFilter ===
      'unread'
    ) {

      this.filteredNotifications =
        this.notifications.filter(
          notification =>
            !this.isRead(notification)
        );

      return;

    }


    if (
      this.activeFilter ===
      'read'
    ) {

      this.filteredNotifications =
        this.notifications.filter(
          notification =>
            this.isRead(notification)
        );

      return;

    }


    this.filteredNotifications =
      [...this.notifications];

  }


  setFilter(
    filter:
      'all' |
      'unread' |
      'read'
  ): void {

    this.activeFilter =
      filter;

    this.applyFilter();

  }


  async markAsRead(
    notification: PlacementNotification
  ): Promise<void> {

    if (
      !notification.id ||
      this.isRead(notification)
    ) {

      return;

    }


    try {

      const updated =
        await this.notificationsService
          .markAsRead(
            notification.id
          );


      const index =
        this.notifications.findIndex(
          item =>
            item.id ===
            notification.id
        );


      if (index !== -1) {

        this.notifications[index] =
          {
            ...this.notifications[index],
            ...updated,
            isRead: true,
            read: true
          };

      }


      this.applyFilter();


    } catch (error: any) {

      console.error(
        'Mark notification read error:',
        error
      );


      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to update notification';

    }

  }


  async markAllAsRead(): Promise<void> {

    const unreadNotifications =
      this.notifications.filter(
        notification =>
          !this.isRead(notification)
      );


    for (
      const notification
      of unreadNotifications
    ) {

      if (notification.id) {

        try {

          await this.notificationsService
            .markAsRead(
              notification.id
            );


          notification.isRead = true;

          notification.read = true;


        } catch (error) {

          console.error(
            'Failed to mark notification:',
            error
          );

        }

      }

    }


    this.applyFilter();


    this.successMessage =
      'All notifications marked as read';


    setTimeout(() => {

      this.successMessage = '';

    }, 3000);

  }


  isRead(
    notification: PlacementNotification
  ): boolean {

    return (
      notification.isRead === true ||
      notification.read === true
    );

  }


  getUnreadCount(): number {

    return this.notifications.filter(
      notification =>
        !this.isRead(notification)
    ).length;

  }


  getNotificationIcon(
    notification:
      PlacementNotification
  ): string {

    const type =
      String(
        notification.type ||
        notification.category ||
        ''
      )
        .toLowerCase();


    if (
      type.includes('job')
    ) {

      return 'bi bi-briefcase-fill';

    }


    if (
      type.includes('application')
    ) {

      return 'bi bi-file-earmark-text-fill';

    }


    if (
      type.includes('placement')
    ) {

      return 'bi bi-award-fill';

    }


    if (
      type.includes('success')
    ) {

      return 'bi bi-check-circle-fill';

    }


    if (
      type.includes('warning')
    ) {

      return 'bi bi-exclamation-triangle-fill';

    }


    return 'bi bi-bell-fill';

  }


  getNotificationClass(
    notification:
      PlacementNotification
  ): string {

    const type =
      String(
        notification.type ||
        notification.category ||
        ''
      )
        .toLowerCase();


    if (
      type.includes('job')
    ) {

      return 'notification-job';

    }


    if (
      type.includes('application')
    ) {

      return 'notification-application';

    }


    if (
      type.includes('placement')
    ) {

      return 'notification-placement';

    }


    return 'notification-default';

  }


  getNotificationDate(
    notification:
      PlacementNotification
  ): string {

    const value =
      notification.createdAt;


    if (!value) {

      return '-';

    }


    if (
      typeof value === 'object' &&
      typeof value.toDate ===
        'function'
    ) {

      return value
        .toDate()
        .toLocaleString();

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '-';

    }


    return date.toLocaleString();

  }


  trackByNotification(
    index: number,
    notification:
      PlacementNotification
  ): string {

    return (
      notification.id ||
      index.toString()
    );

  }

}