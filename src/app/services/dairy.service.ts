import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Dairy {
  id?: number;
  code: string;
  type?: string;
  herdNumber?: number | null;
  milkProduction?: number | null;
  fatPercentage?: number | null;
  weight?: number | null;
  weightDate?: string;
  statueFortification?: string;
  dateOfArtificialInsemination?: string;
  expectedDateOfCalving?: string;
  healthcare?: string;
  gender?: string;
  dateOfBirth?: string;
  madeArtificialInsemination?: string;
  takenVaccinations?: string;
  date: string;
  morningQuantity: number;
  eveningQuantity: number;
  totalQuantity: number;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class DairyService {
  private apiUrl = 'https://sra.runasp.net/api/Dairy'; // Adjust as per your actual API endpoint

  constructor(private http: HttpClient) { }

  getAllDairyRecords(): Observable<Dairy[]> {
    // For demonstration, return mock data
    return of([
      {
        id: 1,
        code: '45',
        type: 'Drying',
        herdNumber: 5,
        milkProduction: null,
        fatPercentage: null,
        weight: 290,
        weightDate: '7/2/2025',
        statueFortification: 'Pregnant',
        dateOfArtificialInsemination: '9/9/2024',
        expectedDateOfCalving: '10/9/2025',
        healthcare: 'In Good Health',
        gender: 'Female',
        dateOfBirth: '1/1/2023',
        madeArtificialInsemination: 'No',
        takenVaccinations: 'ABC Vaccine',
        date: '2024-03-20',
        morningQuantity: 0,
        eveningQuantity: 0,
        totalQuantity: 0,
        notes: ''
      },
      {
        id: 2,
        code: '64',
        type: 'Milch',
        herdNumber: 1,
        milkProduction: 10.5,
        fatPercentage: 3.8,
        weight: 205,
        weightDate: '2/4/2025',
        statueFortification: '—',
        dateOfArtificialInsemination: '—',
        expectedDateOfCalving: '—',
        healthcare: 'In Good Health',
        gender: 'Female',
        dateOfBirth: '1/1/2023',
        madeArtificialInsemination: 'No',
        takenVaccinations: 'ABC Vaccine',
        date: '2024-03-20',
        morningQuantity: 0,
        eveningQuantity: 0,
        totalQuantity: 0,
        notes: ''
      },
      {
        id: 3,
        code: '23',
        type: 'Milch',
        herdNumber: 1,
        milkProduction: 11.2,
        fatPercentage: 3.9,
        weight: 266,
        weightDate: '2/4/2025',
        statueFortification: '—',
        dateOfArtificialInsemination: '—',
        expectedDateOfCalving: '—',
        healthcare: 'In Good Health',
        gender: 'Female',
        dateOfBirth: '1/1/2023',
        madeArtificialInsemination: 'No',
        takenVaccinations: 'ABC Vaccine',
        date: '2024-03-20',
        morningQuantity: 0,
        eveningQuantity: 0,
        totalQuantity: 0,
        notes: ''
      },
      {
        id: 4,
        code: '22',
        type: 'Fattening',
        herdNumber: 1,
        milkProduction: null,
        fatPercentage: null,
        weight: 400,
        weightDate: '21/4/2025',
        statueFortification: '—',
        dateOfArtificialInsemination: '—',
        expectedDateOfCalving: '—',
        healthcare: 'In Good Health',
        gender: 'Female',
        dateOfBirth: '1/1/2023',
        madeArtificialInsemination: 'No',
        takenVaccinations: 'ABC Vaccine',
        date: '2024-03-20',
        morningQuantity: 0,
        eveningQuantity: 0,
        totalQuantity: 0,
        notes: ''
      }
    ]).pipe(
      tap(() => console.log('Fetched mock dairy records')),
      catchError(this.handleError<Dairy[]>('getAllDairyRecords', []))
    );
    // Uncomment the following to use actual API:
    // return this.http.get<Dairy[]>(this.apiUrl).pipe(
    //   tap(records => console.log('Fetched dairy records', records)),
    //   catchError(this.handleError<Dairy[]>('getAllDairyRecords', []))
    // );
  }

  getDairyRecordById(id: number): Observable<Dairy> {
    // For demonstration, return mock data
    return of({
      id: id,
      code: 'D001',
      type: 'Drying',
      herdNumber: 5,
      milkProduction: null,
      fatPercentage: null,
      weight: 290,
      weightDate: '7/2/2025',
      statueFortification: 'Pregnant',
      dateOfArtificialInsemination: '9/9/2024',
      expectedDateOfCalving: '10/9/2025',
      healthcare: 'In Good Health',
      gender: 'Female',
      dateOfBirth: '1/1/2023',
      madeArtificialInsemination: 'No',
      takenVaccinations: 'ABC Vaccine',
      date: '2024-03-20',
      morningQuantity: 5.5,
      eveningQuantity: 4.8,
      totalQuantity: 10.3,
      notes: 'Normal production'
    }).pipe(
      tap(() => console.log(`Fetched mock dairy record id=${id}`)),
      catchError(this.handleError<Dairy>(`getDairyRecordById id=${id}`))
    );
    // Uncomment the following to use actual API:
    // return this.http.get<Dairy>(`${this.apiUrl}/${id}`).pipe(
    //   tap(() => console.log(`Fetched dairy record id=${id}`)),
    //   catchError(this.handleError<Dairy>(`getDairyRecordById id=${id}`))
    // );
  }

  createDairyRecord(dairy: Dairy): Observable<Dairy> {
    // For demonstration, return mock data
    const newRecord = { ...dairy, id: Math.floor(Math.random() * 1000) + 1 };
    return of(newRecord).pipe(
      tap(() => console.log('Added mock dairy record', newRecord)),
      catchError(this.handleError<Dairy>('createDairyRecord'))
    );
    // Uncomment the following to use actual API:
    // return this.http.post<Dairy>(this.apiUrl, dairy).pipe(
    //   tap((newRecord: Dairy) => console.log('Added dairy record', newRecord)),
    //   catchError(this.handleError<Dairy>('createDairyRecord'))
    // );
  }

  updateDairyRecord(dairy: Dairy): Observable<any> {
    // For demonstration, return mock data
    return of(dairy).pipe(
      tap(() => console.log('Updated mock dairy record', dairy)),
      catchError(this.handleError<any>('updateDairyRecord'))
    );
    // Uncomment the following to use actual API:
    // return this.http.put(`${this.apiUrl}/${dairy.id}`, dairy).pipe(
    //   tap(() => console.log('Updated dairy record', dairy)),
    //   catchError(this.handleError<any>('updateDairyRecord'))
    // );
  }

  deleteDairyRecord(id: number): Observable<any> {
    // For demonstration, return mock data
    return of(null).pipe(
      tap(() => console.log(`Deleted mock dairy record id=${id}`)),
      catchError(this.handleError<any>('deleteDairyRecord'))
    );
    // Uncomment the following to use actual API:
    // return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    //   tap(() => console.log(`Deleted dairy record id=${id}`)),
    //   catchError(this.handleError<any>('deleteDairyRecord'))
    // );
  }

  initializeDairy(): Dairy {
    return {
      code: '',
      type: '',
      herdNumber: null,
      milkProduction: null,
      fatPercentage: null,
      weight: null,
      weightDate: '',
      statueFortification: '',
      dateOfArtificialInsemination: '',
      expectedDateOfCalving: '',
      healthcare: '',
      gender: '',
      dateOfBirth: '',
      madeArtificialInsemination: '',
      takenVaccinations: '',
      date: '',
      morningQuantity: 0,
      eveningQuantity: 0,
      totalQuantity: 0,
      notes: ''
    };
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
} 
