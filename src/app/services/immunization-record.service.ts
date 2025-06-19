import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private baseUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ImmunizationRecord[]> {
    return this.http.get<ImmunizationRecord[]>(`${this.baseUrl}/ImmunizationRecord`);
  }

  getById(id: number): Observable<ImmunizationRecord> {
    return this.http.get<ImmunizationRecord>(`${this.baseUrl}/ImmunizationRecord/${id}`);
  }

  create(record: ImmunizationRecord): Observable<ImmunizationRecord> {
    return this.http.post<ImmunizationRecord>(`${this.baseUrl}/ImmunizationRecord`, record);
  }

  update(record: ImmunizationRecord): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/ImmunizationRecord/${record.id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ImmunizationRecord/${id}`);
  }
}
