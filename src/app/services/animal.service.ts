 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService, NotificationItem } from '../services/notification.service';



export interface Animal {
  id: number;
  code: string;
  gender: number;
  animalType: number;
  weight: number;
 weightDate: string;
  description: string;
  noFamily: string;
  dateOfBirth:string
    // 🟩 خصائص جديدة نضيفها هنا
  milk?: number;
  fatPercentage?: number;
  statuForitification?: number;
  dateFertilization?: string;
  expectedDate?: string;
  type?: number;

}

// Maps for frontend ↔ backend conversion
export const genderMap: { [key: string]: number } = {
  Male: 0,
  Female: 1
};

export const animalTypeMap: { [key: string]: number } = {
  Milking: 1,
  Newborn: 2,
  Fattening: 0
};

export const genderReverseMap: { [key: number]: 'Male' | 'Female' } = {
  0: 'Male',
  1: 'Female'
};

export const animalTypeReverseMap: { [key: number]: 'Milking' | 'Newborn' | 'Fattening' } = {
  1: 'Milking',
  2: 'Newborn',
  0: 'Fattening'
};

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) {}


  getAllAnimals(): Observable<Animal[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Animal`).pipe(
    map((data) => data.map(item => ({
      ...item,
      gender: this.mapGenderStringToNumber(item.gender),
      animalType: this.mapAnimalTypeStringToNumber(item.animalType)
    }))),
    catchError(error => {
      console.error('Error fetching animals', error);
      return of([]);
    })
  );
}

private mapGenderStringToNumber(gender: string): number {
  switch (gender.toLowerCase()) {
    case 'female': return 1;
    case 'male': return 0;
    default: return 0;
  }
}

private mapAnimalTypeStringToNumber(type: string): number {
  switch (type.toLowerCase()) {
    case 'milking': return 1;
    case 'newborn': return 2;
    case 'fattening': return 0;
    default: return 0;
  }
}



  getAnimalById(id: number): Observable<any> {



    return this.http.get<any>(`${this.apiUrl}/Animal/${id}` );
  }
createAnimal(animal: Animal): Observable<any> {
  const payload = {
    id: 0,
    code: animal.code,
    gender: animal.gender,
    animalType: animal.animalType,
    weight: animal.weight,
    dateOfWeight: animal.weightDate,
    herdNumber: animal.noFamily,
    description: animal.description,
      dateOfBirth:animal.dateOfBirth
  };
 return this.http.post(`${this.apiUrl}/Animal`, payload);


}
  updateAnimal(animal: Animal): Observable<any> {
    const payload = {
      id: animal.id,
      code: animal.code,
      gender: animal.gender,
      animalType: animal.animalType,
      weight: animal.weight,
      dateOfWeight: animal.weightDate,
      herdNumber: animal.noFamily,
      description: animal.description
    };
    return this.http.put(`${this.apiUrl}/Animal/${animal.id}`, payload);
  }

updateFatteningWeight(payload: {
  id: number;
  code: string;
  description: string;
  weight: number;
  dateOfWeight: string;
}): Observable<any> {
  return this.http.patch(`${this.apiUrl}/Animal/${payload.id}`, payload);
}
  deleteAnimal(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Animal/${id}`);
}

}
