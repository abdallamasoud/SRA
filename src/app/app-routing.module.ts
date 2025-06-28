import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { AnimalsComponent } from './components/animals/animals.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewbornsComponent } from './components/newborn/newborn.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { VaccineComponent } from './components/vaccination/vaccination.component';
import { ReportComponent } from './components/reports/reports.component';
import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { DairyComponent } from './components/dairy/dairy.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';
import { RestpasswordComponent } from './components/auth/restpassword/restpassword.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { isAuthPage: true } },
  { path: 'register', component: RegisterComponent, data: { isAuthPage: true } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { isAuthPage: true } },
  { path: 'reset-password', component: ResetPasswordComponent, data: { isAuthPage: true } },
  { path: 'restpassword', component: RestpasswordComponent, data: { isAuthPage: true } },
  {
    path: '',
    component: SimpleLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard', isAuthPage: false } },
      { path: 'feed', component: FeedComponent, data: { title: 'Feed Management', isAuthPage: false } },
      { path: 'ingredients', component: IngredientsComponent, data: { title: 'Ingredients Management', isAuthPage: false } },
      { path: 'animals', component: AnimalsComponent, data: { title: 'Animals Management', isAuthPage: false } },
      { path: 'newborn', component: NewbornsComponent, data: { title: 'New Born Management', isAuthPage: false } },
      { path: 'dairy', component: DairyComponent, data: { title: 'Dairy Management', isAuthPage: false } },
      { path: 'vaccination', component: VaccineComponent, data: { title: 'Vaccination Management', isAuthPage: false } },
      { path: 'reports', component: ReportComponent, data: { title: 'Reports', isAuthPage: false } },
      { path: 'settings', component: SettingsComponent, data: { title: 'Settings', isAuthPage: false } },
      { path: 'about', component: AboutComponent, data: { title: 'About Us', isAuthPage: false } },
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
