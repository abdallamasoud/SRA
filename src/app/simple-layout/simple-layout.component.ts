import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Data, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

interface CustomRouteData extends Data {
  title?: string;
  isAuthPage?: boolean;
}

@Component({
  selector: 'app-simple-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simple-layout.component.html',
  styleUrls: ['./simple-layout.component.css']
})
export class SimpleLayoutComponent implements OnInit, OnDestroy {
  isAuthPage: boolean = false;
  pageTitle: string = '';
  userName: string = 'John Doe'; // Example user name
  userRole: string = 'Admin'; // Example user role
  showNotificationsDropdown: boolean = false; // Property for notifications dropdown
  showProfileDropdown: boolean = false; // New property for profile dropdown
  private routerSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private elementRef: ElementRef) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      switchMap(route => route.data)
    ).subscribe((data: CustomRouteData) => {
      this.pageTitle = data.title || 'Dashboard';
      this.isAuthPage = data.isAuthPage || false;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getPageTitle(): string {
    return this.pageTitle;
  }

  getUserRole(): string {
    return this.userRole;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleNotificationsDropdown(event: Event): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    this.showProfileDropdown = false; // Close profile dropdown when opening notifications
    event.stopPropagation(); // Prevent document click from immediately closing it
  }

  toggleProfileDropdown(event: Event): void {
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showNotificationsDropdown = false; // Close notifications dropdown when opening profile
    event.stopPropagation(); // Prevent document click from immediately closing it
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    // Close dropdowns if click is outside their respective containers
    if (!this.elementRef.nativeElement.querySelector('.bell-icon-container')?.contains(event.target)) {
      this.showNotificationsDropdown = false;
    }
    if (!this.elementRef.nativeElement.querySelector('#navProfileContainer')?.contains(event.target)) {
      this.showProfileDropdown = false;
    }
  }
}
