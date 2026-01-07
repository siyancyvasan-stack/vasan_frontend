import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SmartNotification {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-smart-notifications',
  standalone: true,
  templateUrl: './smart-notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SmartNotificationsComponent {
  notifications = input.required<SmartNotification[]>();
  dismissAll = output<void>();
}
