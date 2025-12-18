import { Injectable, signal } from '@angular/core';
import { NewFiling } from '../pages/tax-compliance/add-filing-modal/add-filing-modal.component';

export interface Submission {
  id: number;
  taxName: string;
  filingPeriod: string;
  submissionDate: Date | null;
  dueDate: Date;
  amount: number | null;
  currency: 'INR' | 'USD';
  confirmation: string | null;
  status: 'Accepted' | 'Submitted' | 'Processing' | 'Rejected/Error' | 'Due';
}

@Injectable({
  providedIn: 'root'
})
export class FilingHistoryService {
  private initialSubmissions: Submission[] = [
    { id: 1, taxName: 'Annual Income Tax', filingPeriod: 'FY 2024-25', submissionDate: new Date('2025-10-10'), dueDate: new Date('2025-10-10'), amount: 150000, currency: 'INR', confirmation: 'TXN-2025-A8B9C1D4', status: 'Accepted' },
    { id: 2, taxName: 'GST M-3', filingPeriod: '01 Apr 2024 - Period - 30 Sep 2025', submissionDate: new Date('2025-10-05'), dueDate: new Date('2025-10-05'), amount: 25000, currency: 'INR', confirmation: 'X7Y6Z5W2', status: 'Accepted' },
    { id: 3, taxName: 'GST M-3', filingPeriod: '01 Apr 2024 - Period - 30 Sep 2025', submissionDate: new Date('2025-10-05'), dueDate: new Date('2025-10-05'), amount: 25000, currency: 'INR', confirmation: 'X7Y6Z5W2-DUP', status: 'Submitted' },
    { id: 4, taxName: 'Property Tax', filingPeriod: 'H1 2025', submissionDate: new Date('2024-10-31'), dueDate: new Date('2024-10-31'), amount: 12000, currency: 'INR', confirmation: 'PROP-2025-P3S0', status: 'Processing' },
    // FIX: Added missing 'currency' property to conform to the Submission interface.
    { id: 5, taxName: 'TDS Q2 FY24-25', filingPeriod: '01 Apr 2024-2025 - 30 Sep 2025', submissionDate: null, dueDate: new Date('2025-01-15'), amount: null, currency: 'INR', confirmation: 'TDS-29M8N706', status: 'Rejected/Error' },
    { id: 6, taxName: 'Annual Income Tax', filingPeriod: 'FY 2023-24', submissionDate: null, dueDate: new Date('2024-03-31'), amount: 8000, currency: 'INR', confirmation: null, status: 'Due' },
    { id: 7, taxName: 'VAT Return', filingPeriod: 'Q3 2024', submissionDate: new Date('2024-10-20'), dueDate: new Date('2024-10-20'), amount: 5500, currency: 'USD', confirmation: 'VAT-Q3-2024-XYZ', status: 'Accepted' },
    { id: 8, taxName: 'Corporate Tax', filingPeriod: 'Annual 2023', submissionDate: new Date('2024-04-15'), dueDate: new Date('2024-04-15'), amount: 75000, currency: 'USD', confirmation: 'CORP-2023-ABC', status: 'Accepted' },
    { id: 9, taxName: 'GST M-3', filingPeriod: 'Q2 2024', submissionDate: new Date('2024-07-20'), dueDate: new Date('2024-07-20'), amount: 22000, currency: 'INR', confirmation: 'GST-Q2-2024-DEF', status: 'Accepted' },
    { id: 10, taxName: 'TDS Q1 FY24-25', filingPeriod: 'Q1 2024', submissionDate: new Date('2024-07-31'), dueDate: new Date('2024-07-31'), amount: 15000, currency: 'INR', confirmation: 'TDS-Q1-2024-GHI', status: 'Submitted' },
    { id: 11, taxName: 'Advance Tax', filingPeriod: 'Installment 2', submissionDate: null, dueDate: new Date('2024-09-15'), amount: 50000, currency: 'INR', confirmation: null, status: 'Due' },
    { id: 12, taxName: 'Property Tax', filingPeriod: 'H2 2024', submissionDate: null, dueDate: new Date('2025-01-31'), amount: 12500, currency: 'INR', confirmation: null, status: 'Processing' },
    { id: 13, taxName: 'Annual Income Tax', filingPeriod: 'FY 2022-23', submissionDate: new Date('2023-07-31'), dueDate: new Date('2023-07-31'), amount: 7000, currency: 'INR', confirmation: 'ITR-2223-JKL', status: 'Accepted' },
  ];
  
  submissions = signal<Submission[]>(this.initialSubmissions);

  addSubmission(filing: NewFiling) {
    const newSubmission: Submission = {
      id: this.submissions().length + 1,
      taxName: filing.filingName,
      filingPeriod: filing.filingPeriod,
      dueDate: new Date(filing.dueDate),
      amount: filing.amount,
      currency: filing.currency === 'USD' ? 'USD' : 'INR',
      status: filing.status === 'Submitted' ? 'Submitted' : 'Due',
      submissionDate: filing.status === 'Submitted' ? new Date() : null,
      confirmation: filing.status === 'Submitted' ? `TXN-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : null,
    };

    this.submissions.update(submissions => [newSubmission, ...submissions].sort((a,b) => (b.submissionDate?.getTime() || b.dueDate.getTime()) - (a.submissionDate?.getTime() || a.dueDate.getTime())));
  }
}
