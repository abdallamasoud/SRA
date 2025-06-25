import { Injectable } from '@angular/core';
import { AnimalService } from './animal.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from './animal.service';

@Injectable({
  providedIn: 'root'
})
export class NewbornService {
  constructor(private animalService: AnimalService) {}

  getNewborns(): Observable<Animal[]> {
    return this.animalService.getAllAnimals().pipe(
      map(animals => animals.filter(a => a.animalType === 2)) // 2= Newborn
    );
  }
    getNewbornById(id: number): Observable<Animal> {
    return this.animalService.getAnimalById(id).pipe(
      map(animal => {
        if (animal.animalType !== 2) {
          throw new Error('This animal is not a newborn.');
        }
        return animal;
      })
    );
  }

 

  updateNewborn(animal: Animal): Observable<any> {
    return this.animalService.updateAnimal(animal);
  }

  deleteNewborn(id: number): Observable<void> {
    return this.animalService.deleteAnimal(id);
  }

}
