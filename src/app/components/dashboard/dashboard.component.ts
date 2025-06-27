import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardSummary | null = null;
  isLoading = true;
  errorMessage = '';

  // Green color palette
  greenColors = {
    lightGreen: 'rgb(209, 249, 110)',
    mediumLightGreen: '#227D52',
    mediumGreen: '#16432C',
    mediumDarkGreen: 'rgb(30, 235, 129)',
    darkGreen: '#67B990'
  };

  // For the charts
  animalTypeChartData: any[] = [];
  animalGenderChartData: any[] = [];
  weightDistributionChartData: any[] = [];
  milkProductionChartData: any[] = [];

  // Chart options for real charts
  animalTypeChartOptions: any = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.darkGreen
        ],
        hoverBackgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.darkGreen
        ],
        borderWidth: 2,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    },
    plugins: []
  };

  animalGenderChartOptions: any = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.darkGreen
        ],
        hoverBackgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.darkGreen
        ],
        borderWidth: 2,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    },
    plugins: []
  };

  weightDistChartOptions: any = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        data: [],
        label: 'Number of Animals',
        backgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.mediumLightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.mediumDarkGreen,
          this.greenColors.darkGreen
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  };

  milkProductionChartOptions: any = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.mediumLightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.darkGreen
        ],
        hoverBackgroundColor: [
          this.greenColors.lightGreen,
          this.greenColors.mediumLightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.darkGreen
        ],
        borderWidth: 2,
        hoverBorderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    },
    plugins: []
  };

  // Pie chart gradients - kept for compatibility
  animalTypePieGradient: string = '';
  animalGenderPieGradient: string = '';
  milkProductionPieGradient: string = '';

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
        this.generatePieChartGradients();
        this.updateChartOptions();
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

    // Animal type chart data
    this.animalTypeChartData = [
      { name: 'Dairy', value: this.calculateDairyCount() },
      { name: 'Newborn', value: this.calculateNewbornCount() },
      { name: 'Fattening', value: this.calculateFatteningCount() }
    ];

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

    // Prepare milk production quarterly data
    this.milkProductionChartData = [
      { name: 'Spring', value: 55 }, // tons of milk
      { name: 'Summer', value: 65 },
      { name: 'Autumn', value: 52 },
      { name: 'Winter', value: 38 }
    ];
  }

  // Update chart options with data
  updateChartOptions(): void {
    // Update Animal Type Chart
    this.animalTypeChartOptions.data.labels = this.animalTypeChartData.map(item => item.name);
    this.animalTypeChartOptions.data.datasets[0].data = this.animalTypeChartData.map(item => item.value);

    // Update Animal Gender Chart
    this.animalGenderChartOptions.data.labels = this.animalGenderChartData.map(item => item.name);
    this.animalGenderChartOptions.data.datasets[0].data = this.animalGenderChartData.map(item => item.value);

    // Update Weight Distribution Chart
    this.weightDistChartOptions.data.labels = this.weightDistributionChartData.map(item => item.name);
    this.weightDistChartOptions.data.datasets[0].data = this.weightDistributionChartData.map(item => item.value);

    // Update Milk Production Chart
    this.milkProductionChartOptions.data.labels = this.milkProductionChartData.map(item => item.name);
    this.milkProductionChartOptions.data.datasets[0].data = this.milkProductionChartData.map(item => item.value);
  }

  // Generate dynamic pie chart gradients based on actual data values
  generatePieChartGradients(): void {
    this.animalTypePieGradient = this.createConicGradient(
      this.animalTypeChartData,
      [this.greenColors.lightGreen, this.greenColors.mediumGreen, this.greenColors.darkGreen]
    );

    this.animalGenderPieGradient = this.createConicGradient(
      this.animalGenderChartData,
      [this.greenColors.lightGreen, this.greenColors.darkGreen]
    );

    this.milkProductionPieGradient = this.createConicGradient(
      this.milkProductionChartData,
      [this.greenColors.lightGreen, this.greenColors.mediumLightGreen, this.greenColors.mediumGreen, this.greenColors.darkGreen]
    );
  }

  // Helper method to create conic gradient based on data values
  createConicGradient(data: any[], colors: string[]): string {
    if (!data || data.length === 0) return '';

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return '';

    let gradient = 'conic-gradient(';
    let currentPercentage = 0;

    data.forEach((item, index) => {
      if (index >= colors.length) return;

      const percentage = (item.value / total) * 100;
      const nextPercentage = currentPercentage + percentage;

     gradient += `${colors[index]} ${currentPercentage}% ${nextPercentage}%`;

      if (index < data.length - 1 && index < colors.length - 1) {
        gradient += ', ';
      }

      currentPercentage = nextPercentage;
    });

    gradient += ')';
    return gradient;
  }

  // Helper methods to calculate counts for the new categories
  calculateDairyCount(): number {
    // Assuming dairy includes cows and heifers
    const dairyTypes = ['Cow', 'Heifer'];
    return this.sumCountsForTypes(dairyTypes);
  }

  calculateNewbornCount(): number {
    // Assuming newborn includes calves
    const newbornTypes = ['Calf'];
    return this.sumCountsForTypes(newbornTypes);
  }

  calculateFatteningCount(): number {
    // Assuming fattening includes bulls and steers
    const fatteningTypes = ['Bull', 'Steer'];
    return this.sumCountsForTypes(fatteningTypes);
  }

  sumCountsForTypes(types: string[]): number {
    if (!this.dashboardData?.animalsByType) return 0;

    return this.dashboardData.animalsByType
      .filter(item => types.includes(item.type))
      .reduce((sum, item) => sum + item.count, 0);
  }

  getSeasonColor(season: string): string {
    switch (season.toLowerCase()) {
      case 'spring':
        return this.greenColors.lightGreen;
      case 'summer':
        return this.greenColors.mediumLightGreen;
      case 'autumn':
        return this.greenColors.mediumGreen;
      case 'winter':
        return this.greenColors.darkGreen;
      default:
        return this.greenColors.lightGreen;
    }
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

  // Helper method to get colors for legend items based on index and chart type
  getColorForIndex(index: number, chartType: string): string {
    switch(chartType) {
      case 'animalType':
        switch(index) {
          case 0: return this.greenColors.lightGreen;
          case 1: return this.greenColors.mediumGreen;
          case 2: return this.greenColors.darkGreen;
          default: return this.greenColors.lightGreen;
        }
      case 'animalGender':
        return index === 0 ? this.greenColors.lightGreen : this.greenColors.darkGreen;
      case 'weight':
        const colors = [
          this.greenColors.lightGreen,
          this.greenColors.mediumLightGreen,
          this.greenColors.mediumGreen,
          this.greenColors.mediumDarkGreen,
          this.greenColors.darkGreen
        ];
        return colors[index % colors.length];
      default:
        return this.greenColors.lightGreen;
    }
  }
}
