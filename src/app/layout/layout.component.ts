import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  getPageTitle(): string {
    // Extract the page title from the current route
    if (this.currentRoute.includes('/feed')) {
      return 'Feed Management';
    } else if (this.currentRoute.includes('/ingredients')) {
      return 'Ingredients Management';
    } else if (this.currentRoute.includes('/animals')) {
      return 'Animals Management';
    } else if (this.currentRoute.includes('/dairy')) {
      return 'Dairy Management';
    } else if (this.currentRoute.includes('/newborn')) {
      return 'New Born Management';
    } else if (this.currentRoute.includes('/vaccination')) {
      return 'Vaccination Management';
    } else if (this.currentRoute.includes('/reports')) {
      return 'Reports';
    } else if (this.currentRoute.includes('/statistics')) {
      return 'Statistics';
    } else if (this.currentRoute.includes('/settings')) {
      return 'Settings';
    } else if (this.currentRoute.includes('/help')) {
      return 'Help Center';
    } else {
      return 'Dashboard';
    }
  }
}
