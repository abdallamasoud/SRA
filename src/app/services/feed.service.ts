import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IngredientPrice {
  id: number;
  price: number;
}

export interface FeedCreate {
  name: string;
  quntity: number;
  ingredientPrice: IngredientPrice[];
}

export interface Ingredient {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'https://sra.runasp.net/api';

  constructor(private http: HttpClient) { }

  createFeed(feed: FeedCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/Feeds/Eng/CreateFeed`, feed);
  }

  getIngredients(): Observable<Ingredient[]> {
    // This is a placeholder - you'll need to replace with the actual endpoint
    return this.http.get<Ingredient[]>(`${this.apiUrl}/Ingredients`);
  }
}
