import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');  // Check 'auth_token'
    console.log('Token in AuthGuard:', token);  // Debugging log
    if (token) {
      return true;
    } else {
      this.router.navigate(['/']);  // Navigate to login if token is missing
      return false;
    }
  }
}
