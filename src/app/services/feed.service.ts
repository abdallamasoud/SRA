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
  type?: string; // Add type for filtering
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'https://localhost:7174/api';

  constructor(private http: HttpClient) { }

  createFeed(feed: FeedCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/Feeds`, feed);
  }

  getCategories(): Observable<Category[]> {
    console.log('Calling getCategories API:', `${this.apiUrl}/Feeds/GetCategory`);
    return this.http.get<Category[]>(`${this.apiUrl}/Feeds/GetCategory`);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/Ingredients`);
  }

  getIngredientsByType(type?: string): Observable<Ingredient[]> {
    if (type) {
      return this.http.get<Ingredient[]>(`${this.apiUrl}/Ingredients?type=${type}`);
    }
    return this.getIngredients();
  }

  getFeeds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Feeds`);
  }

  deleteFeed(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Feeds/${id}`);
  }

  getFeedById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Feeds/${id}`);
  }
}
