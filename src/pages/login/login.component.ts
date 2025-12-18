import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
<div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-100 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-200/50">
    <div class="space-y-4">
       <div class="flex items-center justify-center gap-3">
        <div class="p-2 bg-gray-800 rounded-lg">
          <div class="grid grid-cols-2 grid-rows-2 gap-1.5">
            <span class="w-3 h-3 bg-white rounded-full"></span>
            <span class="w-3 h-3 bg-white rounded-full"></span>
            <span class="w-3 h-3 bg-white rounded-full"></span>
            <span class="w-3 h-3 bg-white rounded-full"></span>
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Lumina</h1>
          <p class="text-xs font-medium text-gray-500 tracking-widest">ERP & AI SUITE</p>
        </div>
      </div>
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Please sign in to continue
        </p>
      </div>
    </div>
    <form class="mt-8 space-y-6" (ngSubmit)="onLogin()" #loginForm="ngForm">
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <div class="mt-1">
            <input id="username" name="username" type="text" autocomplete="username" required
                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                   [ngModel]="username()" (ngModelChange)="username.set($event)">
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                   [ngModel]="password()" (ngModelChange)="password.set($event)">
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <div class="text-sm">
          <a href="#" class="font-medium text-cyan-600 hover:text-cyan-500">
            Forgot Password?
          </a>
        </div>
      </div>

      @if(loginError()) {
        <p class="text-red-500 text-sm text-center">Invalid credentials. Please try again.</p>
      }

      <div>
        <button type="submit"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg">
          Sign In
        </button>
      </div>
    </form>
    <p class="!mt-6 text-center text-xs text-gray-500">
      Hint: Use username <strong class="font-medium">admin</strong> and password <strong class="font-medium">password</strong>
    </p>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username = signal('admin');
  password = signal('password');
  loginError = signal(false);

  private authService = inject(AuthService);

  onLogin(): void {
    const success = this.authService.login(this.username(), this.password());
    this.loginError.set(!success);
  }
}