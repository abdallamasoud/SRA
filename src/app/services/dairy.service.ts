import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnimalService } from './animal.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from './animal.service';

@Injectable({
  providedIn: 'root'
})
export class DairyService {
  private milkCollectionApi = 'https://sra.runasp.net/api/MilkCollections';

  constructor(
    private animalService: AnimalService,
    private http: HttpClient
  ) {}

  getDairies(): Observable<Animal[]> {
    return this.animalService.getAllAnimals().pipe(
      map(animals => animals.filter(a => a.animalType === 1)) // 0 = Dairy
    );
  }

  getDairyById(id: number): Observable<Animal> {
    return this.animalService.getAnimalById(id).pipe(
      map(animal => {
        if (animal.animalType !== 1) {
          throw new Error('This animal is not a dairy cow.');
        }
        return animal;
      })
    );
  }

  // ✅ إضافة dairy جديد
 addDairy(dairyData: {
  code: string;
  milk: number;
  fatPercentage: number;
}): Observable<any> {
  return this.http.patch(`${this.milkCollectionApi}`, dairyData);
}


  // ✅ تعديل كامل للداتا
  updateDairy(animal: {
    id: number,
    code: string,
    type: number,
    noFamily: string,
    milk: number,
    fatPercentage: number,
    weight: number,
    weightDate: string,
    statuForitification: number,
    dateFertilization: string,
    expectedDate: string,
    description: string
  }): Observable<any> {
    return this.http.put(`${this.milkCollectionApi}/${animal.id}`, animal);
  }

  deleteDairy(id: number): Observable<void> {
    return this.animalService.deleteAnimal(id);
  }
}
