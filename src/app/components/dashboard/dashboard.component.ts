import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

export interface AnimalNumbers {
  total: number;
  pregnant: number;
  newBorn: number;
  fattening: number;
  milch: number;
}

export interface MilkProductionQuarter {
  quarter: string;
  production: string;
}

export interface WeightData {
  week: string;
  weight: number;
}

export interface ScheduleItem {
  time: string;
  description: string;
}

export interface MilkProductionData {
  day: string;
  production: number;
}

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

  animalNumbers: AnimalNumbers = {
    total: 470,
    pregnant: 120,
    newBorn: 150,
    fattening: 100,
    milch: 100
  };

  milkProduction: MilkProductionQuarter[] = [
    { quarter: '1. Summer', production: '100 Ton' },
    { quarter: '2. Autumn', production: '140 Ton' },
    { quarter: '3. Winter', production: '180 Ton' },
    { quarter: '4. Spring', production: '120 Ton' }
  ];

  weightPerWeek: WeightData[] = [
    { week: '1', weight: 300 },
    { week: '2', weight: 100 },
    { week: '3', weight: 500 },
    { week: '4', weight: 700 },
    { week: '5', weight: 200 },
    { week: '6', weight: 800 }
  ];

  upcomingSchedules: ScheduleItem[] = [
    { time: '9:00 AM', description: 'Animals New born have fortification' },
    { time: '10:00 AM', description: 'Animals feed in the morning' },
    { time: '11:00 AM', description: 'Health care check' },
    { time: '12:00 AM', description: 'Check pregnant \'s Date of give birth' },
    { time: '1:00 PM', description: 'Check Feed \'s ingredients' },
    { time: '2:00 PM', description: 'Animals Fattening weight bigger than 450 KG sale them better' }
  ];

  milkProductionChartData: MilkProductionData[] = [
    { day: 'Sun', production: 300 },
    { day: 'Mon', production: 200 },
    { day: 'Tue', production: 500 },
    { day: 'Wed', production: 400 },
    { day: 'Thu', production: 700 },
    { day: 'Fri', production: 600 },
    { day: 'Sat', production: 900 }
  ];

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
