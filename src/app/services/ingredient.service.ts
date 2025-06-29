import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ingredient {
  id?: number;
  name: string;
  type: number|null;
  unit: number;
  cp: number;
  tdn: number;
  cf: number;
  me: number;
  season?: string;
}

@Injectable({ providedIn: 'root' })
export class IngredientService {
  private baseUrl = 'https://localhost:7174/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.baseUrl}/Ingredients`);
  }

  getById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.baseUrl}/Ingredients/${id}`);
  }

  create(ingredient: Ingredient): Observable<Ingredient> {
    console.log('IngredientService - Creating ingredient:', ingredient);
    return this.http.post<Ingredient>(`${this.baseUrl}/Ingredients`, ingredient);
  }

  update(ingredient: Ingredient): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Ingredients/${ingredient.id}`, ingredient);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Ingredients/${id}`);
  }
}
