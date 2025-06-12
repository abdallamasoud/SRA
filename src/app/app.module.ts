import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './components/feed/feed.component';
import { AddFeedModalComponent } from './components/feed/add-feed-modal/add-feed-modal.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { AddIngredientModalComponent } from './components/ingredients/add-ingredient-modal/add-ingredient-modal.component';
import { EditIngredientModalComponent } from './components/ingredients/edit-ingredient-modal/edit-ingredient-modal.component';
import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { AnimalsComponent } from './components/animals/animals.component';
import { AddAnimalModalComponent } from './components/animals/add-animal-modal/add-animal-modal.component';
import { EditAnimalModalComponent } from './components/animals/edit-animal-modal/edit-animal-modal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewbornComponent } from './components/newborn/newborn.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { AnimalService } from './services/animal.service';
import { DairyComponent } from './components/dairy/dairy.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    AddFeedModalComponent,
    IngredientsComponent,
    AddIngredientModalComponent,
    EditIngredientModalComponent,
    AnimalsComponent,
    AddAnimalModalComponent,
    EditAnimalModalComponent,
    DashboardComponent,
    NewbornComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SettingsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    SimpleLayoutComponent,
    DairyComponent
  ],
  providers: [
    CurrencyPipe,
    AnimalService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
