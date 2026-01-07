
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export type UserRole = 'Admin' | 'Finance Manager' | 'Employee' | null;

export interface User {
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  
  private initialUser = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')!) 
    : null;

  currentUser = signal<User | null>(this.initialUser);

  isLoggedIn = signal<boolean>(!!this.initialUser);

  login(role: UserRole): boolean {
    if (!role) return false;

    let userName = 'User';
    switch(role) {
      case 'Admin':
        userName = 'Admin User';
        break;
      case 'Finance Manager':
        userName = 'Finance Manager';
        break;
      case 'Employee':
        userName = 'Employee User';
        break;
    }

    const user: User = { name: userName, role };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    this.router.navigate(['/dashboard']);
    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    if (!user || !user.role) {
      return false;
    }
    return roles.includes(user.role);
  }
}
