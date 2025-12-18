import { ChangeDetectionStrategy, Component, input, output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class NotificationComponent implements AfterViewInit {
  message = input.required<string>();
  type = input.required<'success' | 'info'>();

  close = output<void>();

  ngAfterViewInit() {
    setTimeout(() => this.close.emit(), 3000);
  }

  get iconClass(): string {
    switch (this.type()) {
      case 'success':
        return 'fa-solid fa-check-circle';
      case 'info':
        return 'fa-solid fa-info-circle';
    }
  }

  get colorClasses(): string {
    switch (this.type()) {
      case 'success':
        return 'bg-cyan-50 border-cyan-500 text-cyan-800';
      case 'info':
        return 'bg-sky-50 border-sky-500 text-sky-800';
    }
  }
}