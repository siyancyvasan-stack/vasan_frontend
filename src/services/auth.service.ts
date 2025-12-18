
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  isLoggedIn = signal<boolean>(localStorage.getItem('isLoggedIn') === 'true');

  login(user: string, pass: string): boolean {
    // Mock login logic
    if (user === 'admin' && pass === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedIn.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}