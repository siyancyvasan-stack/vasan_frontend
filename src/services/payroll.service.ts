import { Injectable, computed, signal } from '@angular/core';

export interface PayrollRun {
  id: string;
  date: Date;
  status: 'Completed' | 'Processing' | 'Failed';
  employeeCount: number;
  totalCost: number;
}

export interface PayrollStats {
  nextPayrollDate: Date;
  totalPayrollCost: number;
  costChangePercent: number;
  activeEmployees: number;
  newEmployeesThisMonth: number;
  pendingApprovals: number;
}

export interface PayslipItem {
  description: string;
  amount: number;
}

export interface Payslip {
  id: string;
  employeeName: string;
  employeeId: string;
  payPeriod: string;
  payDate: string;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  earnings: PayslipItem[];
  deductions: PayslipItem[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  salaryStructure: string;
}


@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private payrollRuns = signal<PayrollRun[]>([
    { id: 'PR-2024-001', date: new Date('2024-12-15'), status: 'Completed', employeeCount: 156, totalCost: 245890.00 },
    { id: 'PR-2024-002', date: new Date('2024-11-30'), status: 'Completed', employeeCount: 154, totalCost: 243120.50 },
    { id: 'PR-2024-003', date: new Date('2024-11-15'), status: 'Completed', employeeCount: 152, totalCost: 241500.00 },
    { id: 'PR-2024-004', date: new Date('2024-10-31'), status: 'Completed', employeeCount: 150, totalCost: 238750.75 },
    { id: 'PR-2024-005', date: new Date('2024-10-15'), status: 'Completed', employeeCount: 148, totalCost: 235200.00 },
    { id: 'PR-2024-006', date: new Date('2024-09-30'), status: 'Completed', employeeCount: 145, totalCost: 231400.00 },
    { id: 'PR-2024-007', date: new Date('2024-09-15'), status: 'Failed', employeeCount: 144, totalCost: 229800.00 },
    { id: 'PR-2024-008', date: new Date('2024-08-31'), status: 'Completed', employeeCount: 140, totalCost: 225100.00 },
  ]);

  private allEmployees = signal<Employee[]>([
    { id: 'EMP001', name: 'Sarah Johnson', email: 'sarah.j@company.com', jobTitle: 'Software Engineer', department: 'Engineering', status: 'Active', salaryStructure: 'Tech Standard' },
    { id: 'EMP002', name: 'Michael Chen', email: 'michael.c@company.com', jobTitle: 'Product Manager', department: 'Management', status: 'Active', salaryStructure: 'Management' },
    { id: 'EMP003', name: 'Emily Davis', email: 'emily.d@company.com', jobTitle: 'UX Designer', department: 'Design', status: 'Active', salaryStructure: 'Design Standard' },
    { id: 'EMP004', name: 'James Wilson', email: 'james.w@company.com', jobTitle: 'DevOps Engineer', department: 'Engineering', status: 'Active', salaryStructure: 'Tech Standard' },
    { id: 'EMP005', name: 'Diana Prince', email: 'diana.p@company.com', jobTitle: 'HR Manager', department: 'Human Resources', status: 'On Leave', salaryStructure: 'Management' },
    { id: 'EMP006', name: 'Ethan Hunt', email: 'ethan.h@company.com', jobTitle: 'Sales Executive', department: 'Sales', status: 'Active', salaryStructure: 'Sales Commission' },
    { id: 'EMP007', name: 'Fiona Glenanne', email: 'fiona.g@company.com', jobTitle: 'Marketing Specialist', department: 'Marketing', status: 'Terminated', salaryStructure: 'Marketing Standard' },
    { id: 'EMP008', name: 'Lisa Thompson', email: 'lisa.t@company.com', jobTitle: 'Marketing Lead', department: 'Marketing', status: 'Active', salaryStructure: 'Marketing Standard' }
  ]);
  
  stats = computed<PayrollStats>(() => {
    const runs = this.payrollRuns();
    const latestRun = runs[0];
    const previousRun = runs[1];
    
    const costChange = latestRun && previousRun ? ((latestRun.totalCost - previousRun.totalCost) / previousRun.totalCost) * 100 : 0;

    return {
      nextPayrollDate: new Date('2024-12-31'),
      totalPayrollCost: latestRun?.totalCost ?? 0,
      costChangePercent: costChange,
      activeEmployees: latestRun?.employeeCount ?? 0,
      newEmployeesThisMonth: (latestRun?.employeeCount ?? 0) - (previousRun?.employeeCount ?? 0),
      pendingApprovals: 3
    };
  });

  getRuns() {
    return this.payrollRuns;
  }
  
  getPayslipsForRun(runId: string): Payslip[] {
    return [
      {
        id: 'PS-001', employeeName: 'Sarah Johnson', employeeId: 'EMP001', payPeriod: 'Dec 1 - Dec 15, 2024', payDate: 'Dec 15, 2024',
        grossEarnings: 3500, totalDeductions: 850.50, netPay: 2649.50,
        earnings: [
          { description: 'Regular Pay', amount: 3200 },
          { description: 'Overtime', amount: 300 },
        ],
        deductions: [
          { description: 'Federal Income Tax', amount: 450 },
          { description: 'Social Security', amount: 217 },
          { description: 'Medicare', amount: 50.75 },
          { description: 'Health Insurance', amount: 132.75 },
        ]
      },
      {
        id: 'PS-002', employeeName: 'Michael Chen', employeeId: 'EMP002', payPeriod: 'Dec 1 - Dec 15, 2024', payDate: 'Dec 15, 2024',
        grossEarnings: 4200, totalDeductions: 1100.25, netPay: 3099.75,
        earnings: [
          { description: 'Regular Pay', amount: 4200 },
        ],
        deductions: [
          { description: 'Federal Income Tax', amount: 650 },
          { description: 'Social Security', amount: 260.40 },
          { description: 'Medicare', amount: 60.85 },
          { description: 'Health Insurance', amount: 129.00 },
        ]
      },
      {
        id: 'PS-003', employeeName: 'Emily Davis', employeeId: 'EMP003', payPeriod: 'Dec 1 - Dec 15, 2024', payDate: 'Dec 15, 2024',
        grossEarnings: 3000, totalDeductions: 750.00, netPay: 2250.00,
        earnings: [
          { description: 'Regular Pay', amount: 3000 },
        ],
        deductions: [
          { description: 'Federal Income Tax', amount: 380 },
          { description: 'Social Security', amount: 186 },
          { description: 'Medicare', amount: 43.50 },
          { description: 'Health Insurance', amount: 140.50 },
        ]
      }
    ];
  }

  getMonthlyCostHistory() {
    const runs = this.payrollRuns();
    const monthlyTotals = new Map<string, number>();
    
    runs.forEach(run => {
        const month = run.date.toLocaleString('default', { month: 'short' });
        const year = run.date.getFullYear();
        const key = `${month} '${year.toString().slice(-2)}`;
        if(run.status === 'Completed') {
           monthlyTotals.set(key, (monthlyTotals.get(key) || 0) + run.totalCost);
        }
    });

    return Array.from(monthlyTotals.entries())
        .map(([month, cost]) => ({ month, cost }))
        .reverse() // Newest month first
        .slice(0, 6) // Last 6 months
        .reverse(); // Chronological for chart
  }
  
  // Employee Management
  getEmployees() {
    return this.allEmployees;
  }

  addEmployee(employee: Omit<Employee, 'id'>) {
    this.allEmployees.update(employees => {
      const newIdNumber = Math.max(...employees.map(e => parseInt(e.id.replace('EMP', ''))), 0) + 1;
      const newId = `EMP${newIdNumber.toString().padStart(3, '0')}`;
      const newEmployee: Employee = { ...employee, id: newId };
      return [newEmployee, ...employees];
    });
  }

  updateEmployee(updatedEmployee: Employee) {
    this.allEmployees.update(employees => 
      employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  }
}