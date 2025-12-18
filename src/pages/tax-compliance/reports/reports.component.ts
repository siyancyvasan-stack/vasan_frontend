import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold text-gray-800">Tax Reports</h2>
      <p class="mt-2 text-gray-600">This section is under construction. Reports will be available here soon.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {}