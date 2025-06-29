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
  dob: string;

  // 🟩 خصائص جديدة نضيفها هنا
  milk?: number;
  fatPercentage?: number;
  statuForitification?: number;
  dateFertilization?: string;
  expectedDate?: string;
  type?: number;

  // خصائص جديدة لعرض آخر وزن
  lastWeight?: number;
  lastWeightDate?: string;
  displayWeight?: number;
  displayWeightDate?: string;
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
  private apiUrl = 'https://localhost:7174/api';

  constructor(private http: HttpClient) {}


  getAllAnimals(): Observable<Animal[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Animal`).pipe(
    map((data) => data.map(item => ({
      ...item,
      gender: this.mapGenderStringToNumber(item.gender),
      animalType: this.mapAnimalTypeStringToNumber(item.animalType),
      // إضافة آخر وزن للحيوان
      lastWeight: item.lastWeight || item.weight,
      lastWeightDate: item.lastWeightDate || item.weightDate
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
      dateOfBirth:animal.dob
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
  // استخدام فقط الحقول المطلوبة للباك إند
  const formattedPayload = {
    code: payload.code,
    description: payload.description,
    weight: payload.weight,
    dateOfWeight: payload.dateOfWeight
  };
  
  console.log('AnimalService - Sending PATCH request to:', `${this.apiUrl}/Animal/${payload.id}`);
  console.log('AnimalService - Payload:', formattedPayload);
  
  // استخدام PATCH method مع البيانات المطلوبة فقط
  return this.http.patch(`${this.apiUrl}/Animal/${payload.id}`, formattedPayload).pipe(
    catchError(error => {
      console.error('AnimalService - Error updating fattening weight:', error);
      console.error('AnimalService - Error status:', error.status);
      console.error('AnimalService - Error message:', error.message);
      console.error('AnimalService - Error response:', error.error);
      throw error;
    })
  );
}
  deleteAnimal(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/Animal/${id}`);
}

getAnimalByCode(code: string): Observable<any> {
  // أولاً، جرب البحث بالكود مباشرة
  return this.http.get<any>(`${this.apiUrl}/Animal/code/${code}`).pipe(
    catchError(error => {
      console.error('Error fetching animal by code endpoint:', error);
      
      // إذا فشل، جرب البحث في جميع الحيوانات
      return this.getAllAnimals().pipe(
        map(animals => {
          const foundAnimal = animals.find(animal => 
            animal.code.toLowerCase() === code.toLowerCase()
          );
          if (foundAnimal) {
            return foundAnimal;
          } else {
            throw new Error('Animal not found');
          }
        })
      );
    })
  );
}

// دالة جديدة لجلب آخر وزن لحيوان محدد
getLastWeightForAnimal(animalId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Animal/${animalId}/last-weight`).pipe(
    catchError(error => {
      console.error('Error fetching last weight for animal:', error);
      return of(null);
    })
  );
}

// دالة لجلب جميع الحيوانات مع آخر وزن لكل منها
getAllAnimalsWithLastWeight(): Observable<Animal[]> {
  return this.getAllAnimals().pipe(
    map(animals => {
      // إذا كان الباك إند يوفر آخر وزن، استخدمه
      // وإلا استخدم الوزن الحالي
      return animals.map(animal => ({
        ...animal,
        displayWeight: animal.lastWeight || animal.weight,
        displayWeightDate: animal.lastWeightDate || animal.weightDate
      }));
    })
  );
}

// دالة لجلب سجل الأوزان لحيوان محدد
getWeightHistoryForAnimal(animalId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Animal/${animalId}/weight-history`).pipe(
    catchError(error => {
      console.error('Error fetching weight history for animal:', error);
      return of([]);
    })
  );
}

// دالة لجلب آخر وزن من سجل الأوزان
getLastWeightFromHistory(animalId: number): Observable<any> {
  return this.getWeightHistoryForAnimal(animalId).pipe(
    map(history => {
      if (history && history.length > 0) {
        // ترتيب السجل حسب التاريخ واختيار آخر وزن
        const sortedHistory = history.sort((a, b) => 
          new Date(b.dateOfWeight).getTime() - new Date(a.dateOfWeight).getTime()
        );
        return sortedHistory[0];
      }
      return null;
    })
  );
}

}
