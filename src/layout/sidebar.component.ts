import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  router = inject(Router);

  private allNavItems: NavItem[] = [
      // Admin, Finance Manager, Employee
      { title: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-chart-pie' },
      
      // Admin
      { title: 'User Management', path: '/user-management', icon: 'fa-solid fa-users-cog' },

      // Finance Manager
      { title: 'FINANCE & ACCOUNTING', isHeading: true, icon: '' },
      { 
        title: 'The Ledger', path: '/general-ledger', icon: 'fa-solid fa-book'
      },
      { 
        title: 'Payables', path: '#', icon: 'fa-solid fa-arrow-up-from-bracket'
      },
      { 
        title: 'Receivables', path: '#', icon: 'fa-solid fa-file-invoice-dollar'
      },

      // Finance Manager, Employee
      { title: 'COMPLIANCE & HR FINANCE', isHeading: true, icon: '' },
      { 
        title: 'Tax Compliance & Filing', path: '/tax-compliance', icon: 'fa-solid fa-landmark', open: false, children: [
          { title: 'Tax Dashboard', path: '/tax-compliance/dashboard', icon: '' },
          { title: 'Tax Calendar', path: '/tax-compliance/calendar', icon: '' },
          { title: 'Tax Forms Library', path: '/tax-compliance/forms', icon: '' },
          { title: 'Filing History', path: '/tax-compliance/history', icon: '' },
        ] 
      },
      { 
        title: 'Payroll (Global)', path: '/payroll', icon: 'fa-solid fa-globe', open: false, children: [
          { title: 'Payroll Dashboard', path: '/payroll/dashboard', icon: '' },
          { title: 'Employee Management', path: '/payroll/employees', icon: '' },
          { title: 'Run Payroll', path: '/payroll/run-payroll', icon: '' },
          { title: 'Payslip History', path: '/payroll/history', icon: '' },
        ] 
      },
      { 
        title: 'Expense Management', path: '/expense-management', icon: 'fa-solid fa-credit-card', open: false, children: [
          { title: 'Expense Dashboard', path: '/expense-management/dashboard', icon: '' },
          { title: 'Submit Expense', path: '/expense-management/submit', icon: '' },
          { title: 'My Expenses', path: '/expense-management/my-expenses', icon: '' },
          { title: 'Approval Queue', path: '/expense-management/approvals', icon: '' },
          { title: 'Corporate Cards', path: '/expense-management/cards', icon: '' },
        ]
      }
  ];

  private menuState = signal<{ [key: string]: boolean }>({});

  navItems = computed(() => {
    const role = this.authService.currentUser()?.role;
    let filteredItems: NavItem[] = [];

    switch (role) {
      case 'Admin':
        filteredItems = [
          this.allNavItems[0], // Dashboard
          this.allNavItems[1], // User Management
        ];
        break;
      case 'Finance Manager':
        filteredItems = [
          this.allNavItems[0], // Dashboard
          ...this.allNavItems.slice(2) // Finance & HR sections
        ].map(item => this.filterChildren(item, ['Approval Queue']));
        break;
      case 'Employee':
         filteredItems = [
          this.allNavItems[0], // Dashboard
          ...this.allNavItems.slice(5) // HR sections only
         ].map(item => this.filterChildren(item, ['My Expenses', 'Payslip History', 'Tax Calendar', 'Submit Expense']));
        break;
    }

    return filteredItems.map(item => ({
      ...item,
      open: this.menuState()[item.title] || false
    }));
  });

  private filterChildren(item: NavItem, allowedChildren: string[]): NavItem {
    if (!item.children) {
      // For Employee, make top-level items navigable if they don't have allowed children
      if (this.authService.currentUser()?.role === 'Employee') {
        if(item.title === 'Expense Management') item.path = '/expense-management/my-expenses';
        if(item.title === 'Payroll (Global)') item.path = '/payroll/history';
        if(item.title === 'Tax Compliance & Filing') item.path = '/tax-compliance/calendar';
      }
      return item;
    }
    
    const newChildren = item.children.filter(child => {
       if (this.authService.currentUser()?.role === 'Finance Manager') return child.title !== 'My Expenses' && child.title !== 'Submit Expense';
       if (this.authService.currentUser()?.role === 'Employee') return allowedChildren.includes(child.title);
       return true;
    });

    return { ...item, children: newChildren };
  }
  
  toggleSubMenu(item: NavItem) {
    if (!item.children || item.children.length === 0) {
      if(item.path && item.path !== '#') {
        this.router.navigate([item.path]);
      }
      return;
    }
    this.menuState.update(current => ({...current, [item.title]: !current[item.title]}));
  }

  logout() {
    this.authService.logout();
  }
}
