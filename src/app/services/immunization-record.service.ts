import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface ImmunizationRecord {
  id?: number;
  name: string;
  type: string;
  dose: string;
  date: string; // مثال: '2025-06-19'
}

@Injectable({
  providedIn: 'root'
})
export class ImmunizationRecordService {
  private apiUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ImmunizationRecord[]> {
    return this.http.get<ImmunizationRecord[]>(`${this.apiUrl}/ImmunizationRecord`);
  }

  getById(id: number): Observable<ImmunizationRecord> {
    return this.http.get<ImmunizationRecord>(`${this.apiUrl}/ImmunizationRecord/${id}`);
  }

  create(record: ImmunizationRecord): Observable<ImmunizationRecord> {
    return this.http.post<ImmunizationRecord>(`${this.apiUrl}/ImmunizationRecord`, record);
  }

  update(record: ImmunizationRecord): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ImmunizationRecord/${record.id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ImmunizationRecord/${id}`);
  }
}
