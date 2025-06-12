import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Animal {
  id?: number;
  code: string;
  herdNumber: string;
  animalType: 'Dairy' | 'Newborn' | 'Fattening';
  weight: number;
  weightDate: string;
  dateOfBirth: string;
  healthcareNote: string;
  takenVaccinations?: string;
  madeArtificialInsemination: boolean;
  dateOfArtificialInsemination?: string | null;
  statueOfInsemination: 'Pregnant' | 'Make Insemination Again';
  expectedDateOfCalving?: string | null;
  gender?: 'Male' | 'Female';
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) { }

  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/Animal`).pipe(
      catchError(error => {
        console.error('Error fetching animals', error);
        return of([]);
      })
    );
  }

  getNewbornAnimals(): Observable<Animal[]> {
    // First try to get all animals and filter for newborns
    return this.getAllAnimals().pipe(
      map(animals => {
        // Filter for animals with animalType = 'New Born' (case insensitive)
        return animals.filter(animal =>
          animal.animalType && animal.animalType.toLowerCase() === 'new born'
        );
      }),
      catchError(error => {
        console.error('Error fetching newborn animals', error);

        // Return an empty array or handle error as appropriate, as 'New Born' type is no longer supported by the interface.
        return of([]); // Removed mock data
      })
    );
  }

  getAnimalById(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/Animal/${id}`);
  }

  createAnimal(animal: Animal): Observable<Animal> {
    // Simulate a successful API call for demonstration purposes
    console.log('Mocking animal creation:', animal);
    return of({ ...animal, id: Math.floor(Math.random() * 1000) + 1 }); // Assign a mock ID
  }

  updateAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/Animal/${animal.id}`, animal);
  }

  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Animal/${id}`);
  }
}
