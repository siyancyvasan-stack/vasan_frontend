import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];

  if (requiredRoles && requiredRoles.length > 0) {
    if (authService.hasRole(requiredRoles)) {
      return true;
    }
  }

  // Redirect to the dashboard if user doesn't have the required role
  return router.parseUrl('/dashboard');
};
