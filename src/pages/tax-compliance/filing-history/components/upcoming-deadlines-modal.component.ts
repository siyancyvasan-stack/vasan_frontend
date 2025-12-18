import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilingHistoryService } from '../../../../services/filing-history.service';

@Component({
  selector: 'app-upcoming-deadlines-modal',
  standalone: true,
  templateUrl: './upcoming-deadlines-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class UpcomingDeadlinesModalComponent {
  private filingHistoryService = inject(FilingHistoryService);
  close = output<void>();

  upcomingDeadlines = computed(() => {
    const now = new Date();
    return this.filingHistoryService.submissions()
      .filter(s => (s.status === 'Due' || s.status === 'Processing') && s.dueDate >= now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  });
}