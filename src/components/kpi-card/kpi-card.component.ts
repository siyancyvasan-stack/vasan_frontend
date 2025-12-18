import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class KpiCardComponent {
  title = input.required<string>();
  value = input.required<string>();
  change = input.required<string>();
  changeType = input.required<'positive' | 'negative' | 'neutral'>();
  icon = input.required<string>();
  subtitle = input<string>();

  get changeColorClass(): string {
    switch (this.changeType()) {
      case 'positive': return 'bg-cyan-100 text-cyan-800';
      case 'negative': return 'bg-pink-100 text-pink-800';
      case 'neutral': return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  }

  get iconBgClass(): string {
    switch (this.title()) {
        case 'CASH ON HAND': return 'bg-cyan-100';
        case 'ACCOUNTS RECEIVABLE': return 'bg-sky-100';
        case 'ACCOUNTS PAYABLE': return 'bg-pink-100';
        case 'NET PROFIT (YTD)': return 'bg-purple-100';
        default: return 'bg-gray-100';
    }
  }

  get iconColorClass(): string {
    switch (this.title()) {
        case 'CASH ON HAND': return 'text-cyan-600';
        case 'ACCOUNTS RECEIVABLE': return 'text-sky-600';
        case 'ACCOUNTS PAYABLE': return 'text-pink-600';
        case 'NET PROFIT (YTD)': return 'text-purple-600';
        default: return 'text-gray-500';
    }
  }
}