import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Finance Manager' | 'Employee';
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  templateUrl: './user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class UserManagementComponent {
  users: User[] = [
    { id: 'USR001', name: 'Admin User', email: 'admin@lumina.com', role: 'Admin', status: 'Active' },
    { id: 'USR002', name: 'Finance Manager', email: 'manager@lumina.com', role: 'Finance Manager', status: 'Active' },
    { id: 'USR003', name: 'Employee User', email: 'employee@lumina.com', role: 'Employee', status: 'Active' },
    { id: 'USR004', name: 'Jane Doe', email: 'jane.d@lumina.com', role: 'Employee', status: 'Inactive' },
  ];

  getRoleClass(role: User['role']) {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Finance Manager': return 'bg-cyan-100 text-cyan-800';
      case 'Employee': return 'bg-sky-100 text-sky-800';
    }
  }

  getStatusClass(status: User['status']) {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  }
}
