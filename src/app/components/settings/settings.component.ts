import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  showEditProfileModal = false;
  showGiveAccessModal = false;
  showGiveAccessEngineerModal = false;

  engineers = [
    { name: 'Engineer 1', email: 'eng1@example.com' },
    { name: 'Engineer 2', email: 'eng2@example.com' }
  ];

  openEditProfileModal() {
    this.showEditProfileModal = true;
  }

  closeEditProfileModal() {
    this.showEditProfileModal = false;
  }

  openGiveAccessModal() {
    this.showGiveAccessModal = true;
  }

  closeGiveAccessModal() {
    this.showGiveAccessModal = false;
  }

  openGiveAccessEngineerModal() {
    this.showGiveAccessEngineerModal = true;
  }

  closeGiveAccessEngineerModal() {
    this.showGiveAccessEngineerModal = false;
  }

  deleteEngineer(engineer: {name: string, email: string}) {
    this.engineers = this.engineers.filter(e => e !== engineer);
  }
} 