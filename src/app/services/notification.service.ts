import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface NotificationItem {
  title: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationItem[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private currentNotifications: NotificationItem[] = [];

  addNotification(title: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.currentNotifications.unshift({ title, time: `الآن (${time})` });

    this.notificationsSubject.next(this.currentNotifications);
  }
}
