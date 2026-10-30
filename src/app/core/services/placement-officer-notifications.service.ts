import { Injectable } from '@angular/core';

import { ApiService } from './api.service';


export interface PlacementNotification {

  id?: string;

  userId?: string;

  title?: string;

  message?: string;

  type?: string;

  category?: string;

  isRead?: boolean;

  read?: boolean;

  createdAt?: any;

  updatedAt?: any;

}


export interface NotificationsApiResponse {

  success: boolean;

  data: PlacementNotification[];

}


export interface NotificationApiResponse {

  success: boolean;

  data: PlacementNotification;

}


@Injectable({
  providedIn: 'root'
})
export class PlacementOfficerNotificationsService {


  constructor(
    private apiService: ApiService
  ) {}


  async getNotifications():
    Promise<PlacementNotification[]> {

    const response =
      await this.apiService
        .get<NotificationsApiResponse>(
          '/placement-officer/notifications'
        );


    return response.data;

  }


  async getNotificationById(
    notificationId: string
  ): Promise<PlacementNotification> {

    const response =
      await this.apiService
        .get<NotificationApiResponse>(
          `/placement-officer/notifications/${notificationId}`
        );


    return response.data;

  }


  async markAsRead(
    notificationId: string
  ): Promise<PlacementNotification> {

    const response =
      await this.apiService
        .patch<NotificationApiResponse>(
          `/placement-officer/notifications/${notificationId}/read`,
          {}
        );


    return response.data;

  }

}