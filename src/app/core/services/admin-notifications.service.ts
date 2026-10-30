import {
  Injectable
} from '@angular/core';

import {
  ApiService
} from './api.service';


export interface AdminNotification {

  id?: string;

  userId?: string;

  title?: string;

  message?: string;

  type?: string;

  category?: string;

  status?: string;

  isRead?: boolean;

  read?: boolean;

  createdAt?: any;

  updatedAt?: any;

}


interface NotificationsResponse {

  success: boolean;

  count: number;

  data: AdminNotification[];

}


interface NotificationResponse {

  success: boolean;

  message: string;

  data: AdminNotification;

}


@Injectable({
  providedIn: 'root'
})
export class AdminNotificationsService {

  constructor(
    private apiService: ApiService
  ) {}


  getAllNotifications():
    Promise<NotificationsResponse> {

    return this.apiService.get<NotificationsResponse>(
      '/admin/notifications'
    );

  }


  updateNotification(
    id: string,
    data: Partial<AdminNotification>
  ): Promise<NotificationResponse> {

    return this.apiService.put<NotificationResponse>(
      `/admin/notifications/${id}`,
      data
    );

  }


  deleteNotification(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {

    return this.apiService.delete<{
      success: boolean;
      message: string;
    }>(
      `/admin/notifications/${id}`
    );

  }

}