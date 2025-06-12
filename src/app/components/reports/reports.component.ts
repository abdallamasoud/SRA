import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ReportItem {
  id: number;
  text: string;
}

export interface ReportSection {
  title: string;
  icon: string;
  items: ReportItem[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportSections: ReportSection[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadReportSections();
  }

  loadReportSections(): void {
    this.reportSections = [
      {
        title: 'Ingredients',
        icon: 'assets/images/ingredients-icon.svg',
        items: [
          { id: 1, text: 'Cosmic spores was deleted.' },
          { id: 2, text: 'Cosmic spores was deleted. (more)' },
          { id: 3, text: 'Engineer add new ingredient with name Corn 22% proteins.' },
          { id: 4, text: 'Engineer use many ingredients to day.' },
          { id: 5, text: 'Another ingredient update.' },
          { id: 6, text: 'Ingredient supply replenished.' }
        ],
      },
      {
        title: 'Feed',
        icon: 'assets/images/hay-bale@2x.png',
        items: [
          { id: 1, text: 'Engineer Make new feed with name newborn feed with 16% proteins.' },
          { id: 2, text: 'Engineer make new feed with name newborn feed with 16% proteins. (more)' },
          { id: 3, text: 'Engineer make new feed with name Big Buffalo with 18% proteins.' },
          { id: 4, text: 'Engineer make edit on newborn feed.' },
          { id: 5, text: 'Engineer make edit on newborn feed. (more)' },
          { id: 6, text: 'Feed quantity adjusted.' },
          { id: 7, text: 'New feed formula implemented.' }
        ],
      },
      {
        title: 'Vaccination',
        icon: 'assets/images/syringe@2x.png',
        items: [
          { id: 1, text: 'Engineer Make new feed with name newborn feed with 16% proteins.' },
          { id: 2, text: 'Engineer make new feed with name newborn feed with 16% proteins. (more)' },
          { id: 3, text: 'Engineer make new feed with name newborn feed with 16% proteins.' },
          { id: 4, text: 'Engineer make new feed with name newborn feed with 16% proteins. (more)' },
          { id: 5, text: 'Vaccination record updated.' },
          { id: 6, text: 'Upcoming vaccination reminder.' }
        ],
      },
      {
        title: 'New Born',
        icon: 'assets/images/cow-1@2x.png',
        items: [
          { id: 1, text: 'Engineer Make new feed with name newborn feed with 16% proteins.' },
          { id: 2, text: 'Engineer make new feed with name newborn feed with 16% proteins. (more)' },
          { id: 3, text: 'Engineer make new feed with name newborn feed with 16% proteins.' },
          { id: 4, text: 'Engineer make new feed with name Big Buffalo with 18% proteins. (more)' },
          { id: 5, text: 'New born health check complete.' },
          { id: 6, text: 'Newborn animal registered.' }
        ],
      },
      {
        title: 'Milch',
        icon: 'assets/images/milk-can@2x.png',
        items: [
          { id: 1, text: 'Engineer Make new feed with name newborn feed with 16% proteins.' },
          { id: 2, text: 'Engineer make new feed with name Big Buffalo with 18% proteins. (more)' },
          { id: 3, text: 'Engineer make edit on newborn feed.' },
          { id: 4, text: 'Engineer make edit on newborn feed. (more)' },
          { id: 5, text: 'Engineer make edit on newborn feed.' },
          { id: 6, text: 'Milk production report generated.' },
          { id: 7, text: 'Dairy animal feeding updated.' }
        ],
      },
      {
        title: 'HealthCare',
        icon: 'assets/images/healthcare-icon.svg',
        items: [
          { id: 1, text: 'Cosmic spores was deleted.' },
          { id: 2, text: 'Cosmic spores was deleted. (more)' },
          { id: 3, text: 'Engineer add new ingredient with name Corn 22% proteins.' },
          { id: 4, text: 'Engineer use many ingredients to day.' },
          { id: 5, text: 'Animal vaccinated.' },
          { id: 6, text: 'Health check performed.' }
        ],
      }
    ];
  }

  printReport(): void {
    window.print();
  }
}
