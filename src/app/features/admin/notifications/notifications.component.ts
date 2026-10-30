import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AdminNotificationsService,
  AdminNotification
} from '../../../core/services/admin-notifications.service';


@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './notifications.component.html',

  styleUrl:
    './notifications.component.css'
})
export class NotificationsComponent
  implements OnInit {


  notifications:
    AdminNotification[] = [];


  filteredNotifications:
    AdminNotification[] = [];


  searchTerm = '';


  selectedStatus = 'All';


  selectedType = 'All';


  loading = false;


  errorMessage = '';


  successMessage = '';


  showViewModal = false;


  showEditModal = false;


  selectedNotification:
    AdminNotification | null = null;


  editingNotification:
    AdminNotification | null = null;


  constructor(
    private notificationService:
      AdminNotificationsService
  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  async loadNotifications(): Promise<void> {

    try {

      this.loading = true;

      this.errorMessage = '';

      const response =
        await this.notificationService
          .getAllNotifications();

      this.notifications =
        response.data || [];

      this.applyFilters();

    } catch (error: any) {

      console.error(
        'Load notifications error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to load notifications';

    } finally {

      this.loading = false;

    }

  }


  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredNotifications =
      this.notifications.filter(
        notification => {

          const matchesSearch =
            !search ||

            notification.title
              ?.toLowerCase()
              .includes(search) ||

            notification.message
              ?.toLowerCase()
              .includes(search) ||

            notification.userId
              ?.toLowerCase()
              .includes(search) ||

            notification.type
              ?.toLowerCase()
              .includes(search);


          const matchesStatus =
            this.selectedStatus === 'All' ||

            this.getNotificationStatus(
              notification
            ) === this.selectedStatus;


          const matchesType =
            this.selectedType === 'All' ||

            notification.type ===
              this.selectedType;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );

        }
      );

  }


  getNotificationStatus(
    notification: AdminNotification
  ): string {

    if (
      notification.status
    ) {

      return notification.status;

    }


    if (
      notification.isRead ||
      notification.read
    ) {

      return 'Read';

    }


    return 'Unread';

  }


  get totalNotifications(): number {

    return this.notifications.length;

  }


  get unreadNotifications(): number {

    return this.notifications.filter(
      notification =>
        this.getNotificationStatus(
          notification
        ) === 'Unread'
    ).length;

  }


  get readNotifications(): number {

    return this.notifications.filter(
      notification =>
        this.getNotificationStatus(
          notification
        ) === 'Read'
    ).length;

  }


  get systemNotifications(): number {

    return this.notifications.filter(
      notification =>
        notification.type
          ?.toLowerCase() === 'system'
    ).length;

  }


  viewNotification(
    notification: AdminNotification
  ): void {

    this.selectedNotification =
      notification;

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedNotification = null;

  }


  editNotification(
    notification: AdminNotification
  ): void {

    this.editingNotification = {
      ...notification
    };

    this.showEditModal = true;

    this.successMessage = '';

    this.errorMessage = '';

  }


  closeEditModal(): void {

    this.showEditModal = false;

    this.editingNotification = null;

  }


  async saveNotification(): Promise<void> {

    if (
      !this.editingNotification?.id
    ) {

      return;

    }


    try {

      this.loading = true;

      this.errorMessage = '';


      const id =
        this.editingNotification.id;


      const {
        id: notificationId,
        createdAt,
        updatedAt,
        ...data
      } =
        this.editingNotification;


      const response =
        await this.notificationService
          .updateNotification(
            id,
            data
          );


      const index =
        this.notifications.findIndex(
          notification =>
            notification.id === id
        );


      if (index !== -1) {

        this.notifications[index] =
          response.data;

      }


      this.applyFilters();

      this.showEditModal = false;

      this.editingNotification = null;

      this.successMessage =
        'Notification updated successfully';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);

    } catch (error: any) {

      console.error(
        'Update notification error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to update notification';

    } finally {

      this.loading = false;

    }

  }


  async deleteNotification(
    notification: AdminNotification
  ): Promise<void> {

    if (!notification.id) {

      return;

    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this notification?'
      );


    if (!confirmed) {

      return;

    }


    try {

      this.loading = true;

      this.errorMessage = '';


      await this.notificationService
        .deleteNotification(
          notification.id
        );


      this.notifications =
        this.notifications.filter(
          item =>
            item.id !== notification.id
        );


      this.applyFilters();


      this.successMessage =
        'Notification deleted successfully';


      setTimeout(() => {

        this.successMessage = '';

      }, 3000);

    } catch (error: any) {

      console.error(
        'Delete notification error:',
        error
      );

      this.errorMessage =
        error?.error?.message ||
        'Unable to delete notification';

    } finally {

      this.loading = false;

    }

  }


  formatDate(
    value: any
  ): string {

    if (!value) {

      return '-';

    }


    let date: Date;


    if (
      value?.seconds
    ) {

      date =
        new Date(
          value.seconds * 1000
        );

    } else {

      date =
        new Date(value);

    }


    if (
      isNaN(date.getTime())
    ) {

      return '-';

    }


    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  getStatusClass(
    notification: AdminNotification
  ): string {

    const status =
      this.getNotificationStatus(
        notification
      ).toLowerCase();


    if (status === 'read') {

      return 'status-read';

    }


    return 'status-unread';

  }


  trackByNotification(
    index: number,
    notification: AdminNotification
  ): string {

    return notification.id ||
      index.toString();

  }

}