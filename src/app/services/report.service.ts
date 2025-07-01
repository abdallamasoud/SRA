import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface Report {
  date: string;
  type: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
    private apiUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }
}
