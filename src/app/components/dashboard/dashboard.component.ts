import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  isLoading = true;
  errorMessage = '';

  // For the charts
  animalTypeChartData: any[] = [];
  animalGenderChartData: any[] = [];
  weightDistributionChartData: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data', error);
        this.errorMessage = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  prepareChartData(): void {
    if (!this.dashboardData) return;

    // Prepare animal type chart data
    this.animalTypeChartData = this.dashboardData.animalsByType.map(item => ({
      name: item.type,
      value: item.count
    }));

    // Prepare animal gender chart data
    this.animalGenderChartData = this.dashboardData.animalsByGender.map(item => ({
      name: item.gender,
      value: item.count
    }));

    // Prepare weight distribution chart data
    this.weightDistributionChartData = this.dashboardData.weightDistribution.map(item => ({
      name: item.range,
      value: item.count
    }));
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getStockStatus(quantity: number): string {
    if (quantity <= 500) return 'low';
    if (quantity <= 1500) return 'medium';
    return 'good';
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysUntil(dateString: string): number {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getUrgencyClass(daysUntil: number): string {
    if (daysUntil <= 3) return 'urgent';
    if (daysUntil <= 7) return 'soon';
    return 'normal';
  }
}
