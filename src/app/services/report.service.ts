import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report {
  date: string;
  type: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://sra.runasp.net/api/Reports';

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }
}
