import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/Original/Meal-Planner-Project/backend_php/api/';  // API URL

  constructor(private http: HttpClient) {}

  // Login user
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}login`, body);
  }

  // Save token to localStorage
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);  // Ensure the token is being saved
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');  // Make sure this matches the key
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
