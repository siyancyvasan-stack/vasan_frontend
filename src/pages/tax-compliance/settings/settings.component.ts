import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold text-gray-800">Tax Settings</h2>
      <p class="mt-2 text-gray-600">This section is under construction. Settings will be available here soon.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}