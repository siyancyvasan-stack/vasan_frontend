
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connect-portal-modal',
  standalone: true,
  templateUrl: './connect-portal-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule]
})
export class ConnectPortalModalComponent {
  close = output<void>();
  connect = output<void>();

  selectedCountry = signal('USA (IRS)');
  username = signal('');
  password = signal('');
  isConnecting = signal(false);
  errorMessage = signal<string | null>(null);

  onConnect() {
    this.errorMessage.set(null);
    if (!this.username() || !this.password()) {
        this.errorMessage.set('Username and password are required.');
        return;
    }

    this.isConnecting.set(true);
    // Simulate API call to connect to the portal
    setTimeout(() => {
        this.isConnecting.set(false);
        this.connect.emit();
    }, 1500);
  }
}