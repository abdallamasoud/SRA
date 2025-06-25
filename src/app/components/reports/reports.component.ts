import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

enum ReportType {
  Feed = 0,
  Vaccination = 1,
  Animal = 2,
  Dairy = 3
}

interface Report {
  date: string;
  type: ReportType;
  message: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportComponent implements OnInit {
  reports: Report[] = [];
  feedReports: Report[] = [];
  vaccinationReports: Report[] = [];
  animalReports: Report[] = [];
  dairyReports: Report[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.http.get<Report[]>('https://sra.runasp.net/api/Reports').subscribe({
      next: (data) => {
        this.reports = data;
        this.feedReports = this.filterReportsByType(ReportType.Feed);
        this.vaccinationReports = this.filterReportsByType(ReportType.Vaccination);
        this.animalReports = this.filterReportsByType(ReportType.Animal);
        this.dairyReports = this.filterReportsByType(ReportType.Dairy);
      },
      error: (err) => console.error('Error fetching reports', err)
    });
  }

  filterReportsByType(type: ReportType): Report[] {
    return this.reports.filter(report => report.type === type);
  }

  printReport(): void {
    window.print(); // لو عايز تطبع جزء معين قولي أظبطه
  }
}
