import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnimalService } from './animal.service';

export interface DashboardSummary {
  totalAnimals: number;
  animalsByType: {type: string, count: number}[];
  animalsByGender: {gender: string, count: number}[];
  recentAnimals: any[];
  weightDistribution: {range: string, count: number}[];
  feedStock: {name: string, quantity: number}[];
  ingredientStock: {name: string, quantity: number}[];
  upcomingVaccinations: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(
    private http: HttpClient,
    private animalService: AnimalService
  ) { }

  getDashboardSummary(): Observable<DashboardSummary> {
    // In a real application, you would fetch this data from the API
    // For now, we'll return mock data
    return of(this.getMockDashboardData()).pipe(
      catchError(error => {
        console.error('Error fetching dashboard data', error);
        return of(this.getEmptyDashboardData());
      })
    );
  }

  private getMockDashboardData(): DashboardSummary {
    return {
      totalAnimals: 125,
      animalsByType: [
        { type: 'Cow', count: 45 },
        { type: 'Bull', count: 15 },
        { type: 'Calf', count: 30 },
        { type: 'Heifer', count: 25 },
        { type: 'Steer', count: 10 }
      ],
      animalsByGender: [
        { gender: 'Male', count: 55 },
        { gender: 'Female', count: 70 }
      ],
      recentAnimals: [
        { id: 1, code: 'A001', animalType: 'Cow', gender: 'Female', weight: 450, weightDate: '2023-05-10' },
        { id: 2, code: 'A002', animalType: 'Bull', gender: 'Male', weight: 800, weightDate: '2023-05-12' },
        { id: 3, code: 'A003', animalType: 'Calf', gender: 'Female', weight: 120, weightDate: '2023-05-15' },
        { id: 4, code: 'A004', animalType: 'Heifer', gender: 'Female', weight: 350, weightDate: '2023-05-18' }
      ],
      weightDistribution: [
        { range: '0-200 kg', count: 30 },
        { range: '201-400 kg', count: 45 },
        { range: '401-600 kg', count: 35 },
        { range: '601-800 kg', count: 10 },
        { range: '801+ kg', count: 5 }
      ],
      feedStock: [
        { name: 'Dairy Feed', quantity: 2500 },
        { name: 'Calf Starter', quantity: 1200 },
        { name: 'Beef Finisher', quantity: 1800 },
        { name: 'Hay Mix', quantity: 3000 }
      ],
      ingredientStock: [
        { name: 'Corn', quantity: 5000 },
        { name: 'Soybean Meal', quantity: 3000 },
        { name: 'Wheat Bran', quantity: 2000 },
        { name: 'Vitamins', quantity: 500 }
      ],
      upcomingVaccinations: [
        { id: 1, animalCode: 'A001', vaccineName: 'FMD Vaccine', dueDate: '2023-06-15' },
        { id: 2, animalCode: 'A005', vaccineName: 'BQ Vaccine', dueDate: '2023-06-18' },
        { id: 3, animalCode: 'A010', vaccineName: 'Anthrax Vaccine', dueDate: '2023-06-20' },
        { id: 4, animalCode: 'A015', vaccineName: 'HS Vaccine', dueDate: '2023-06-25' }
      ]
    };
  }

  private getEmptyDashboardData(): DashboardSummary {
    return {
      totalAnimals: 0,
      animalsByType: [],
      animalsByGender: [],
      recentAnimals: [],
      weightDistribution: [],
      feedStock: [],
      ingredientStock: [],
      upcomingVaccinations: []
    };
  }
}
