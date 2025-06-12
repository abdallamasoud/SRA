import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ingredient {
  id: number;
  name: string;
  type: number;
  unit: number;
  cp: number;  // Crude Protein
  tdn: number; // Total Digestible Nutrients
  cf: number;  // Crude Fiber
  me: number;  // Metabolizable Energy
}

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) { }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/Ingredients`);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/Ingredients/${id}`);
  }

  createIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.apiUrl}/Ingredients`, ingredient);
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/Ingredients/${ingredient.id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Ingredients/${id}`);
  }
}
