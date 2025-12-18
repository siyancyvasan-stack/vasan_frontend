import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

interface NavItem {
  title: string;
  path?: string;
  icon: string;
  isHeading?: boolean;
  children?: NavItem[];
  open?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class SidebarComponent {
  authService = inject(AuthService);

  navItems = signal<NavItem[]>([
    { title: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-chart-pie' },
    { title: 'Reports', path: '#', icon: 'fa-solid fa-chart-simple' },
    { title: 'FINANCE & ACCOUNTING', isHeading: true, icon: '' },
    { 
      title: 'The Ledger', path: '#', icon: 'fa-solid fa-book', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'General Ledger', path: '/general-ledger', icon: '' },
        { title: 'Fixed Asset Management', path: '#', icon: '' },
        { title: 'Financial Consolidation', path: '#', icon: '' },
      ]
    },
    { 
      title: 'Payables', path: '#', icon: 'fa-solid fa-arrow-up-from-bracket', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'AP Automation', path: '#', icon: '' },
        { title: 'Procurement', path: '#', icon: '' },
        { title: 'Audit Management', path: '#', icon: '' },
      ]
    },
    { 
      title: 'Receivables', path: '#', icon: 'fa-solid fa-file-invoice-dollar', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'AR & Collections', path: '#', icon: '' },
        { title: 'Budgeting & Forecasting', path: '#', icon: '' },
        { title: 'Treasury Management', path: '#', icon: '' },
      ]
    },
    { title: 'COMPLIANCE & HR FINANCE', isHeading: true, icon: '' },
    { 
      title: 'Tax Compliance & Filing', path: '/tax-compliance', icon: 'fa-solid fa-landmark', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'Tax Dashboard', path: '/tax-compliance/dashboard', icon: '' },
        { title: 'Tax Calendar', path: '/tax-compliance/calendar', icon: '' },
        { title: 'Tax Forms Library', path: '/tax-compliance/forms', icon: '' },
        { title: 'Filing History', path: '/tax-compliance/history', icon: '' },
      ] 
    },
    { 
      title: 'Payroll (Global)', path: '/payroll', icon: 'fa-solid fa-globe', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'Payroll Dashboard', path: '/payroll/dashboard', icon: '' },
        { title: 'Employee Management', path: '/payroll/employees', icon: '' },
        { title: 'Run Payroll', path: '/payroll/run-payroll', icon: '' },
        { title: 'Payslip History', path: '/payroll/history', icon: '' },
      ] 
    },
    { 
      title: 'Expense Management', path: '/expense-management', icon: 'fa-solid fa-credit-card', open: false, children: [
        // FIX: Added missing 'icon' property to child NavItem objects to conform to the NavItem interface.
        { title: 'Expense Dashboard', path: '/expense-management/dashboard', icon: '' },
        { title: 'Submit Expense', path: '/expense-management/submit', icon: '' },
        { title: 'My Expenses', path: '/expense-management/my-expenses', icon: '' },
        { title: 'Approval Queue', path: '/expense-management/approvals', icon: '' },
        { title: 'Corporate Cards', path: '/expense-management/cards', icon: '' },
      ]
    }
  ]);
  
  toggleSubMenu(item: NavItem) {
    if (!item.children) {
      return;
    }

    const wasOpen = item.open;

    // Accordion-style: close other submenus
    this.navItems.update(items =>
      items.map(i => (i.children && i !== item ? { ...i, open: false } : i))
    );

    // Toggle the state of the clicked item
    this.navItems.update(items => 
      items.map(i => (i === item ? { ...i, open: !wasOpen } : i))
    );
  }

  logout() {
    this.authService.logout();
  }
}