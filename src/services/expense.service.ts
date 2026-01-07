
import { Injectable, signal } from '@angular/core';

export interface ExpenseClaim {
  id: number;
  employeeName: string;
  date: string;
  merchant: string;
  category: string;
  description: string;
  amount: number | null;
  currency: string;
  tags: string[];
  paymentMethod: 'Reimbursement' | 'Corporate Card';
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptImageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private claims = signal<ExpenseClaim[]>([
    { id: 104, employeeName: 'Jane Doe', date: '2024-12-13', merchant: 'Marriott', category: 'Travel', description: 'Hotel stay for client visit', amount: 18500, currency: 'INR', tags: ['travel', 'client-visit'], paymentMethod: 'Corporate Card', status: 'Pending', receiptImageUrl: 'https://picsum.photos/seed/receipt1/400/600' },
    { id: 105, employeeName: 'Employee User', date: '2024-12-11', merchant: 'The Capital Grille', category: 'Food', description: 'Dinner with client', amount: 7200, currency: 'INR', tags: ['client-meeting'], paymentMethod: 'Reimbursement', status: 'Pending', receiptImageUrl: 'https://picsum.photos/seed/receipt2/400/600' },
    { id: 101, employeeName: 'Employee User', date: '2024-12-12', merchant: 'Uber', category: 'Travel', description: 'Trip to airport', amount: 850, currency: 'INR', tags: ['travel'], paymentMethod: 'Reimbursement', status: 'Pending', receiptImageUrl: 'https://picsum.photos/seed/receipt3/400/600' },
    { id: 102, employeeName: 'Employee User', date: '2024-12-12', merchant: 'SpiceJet', category: 'Travel', description: 'Flight to Mumbai', amount: 12500, currency: 'INR', tags: ['travel', 'client-visit'], paymentMethod: 'Corporate Card', status: 'Approved' },
    { id: 2, employeeName: 'Jane Doe', date: '2024-12-11', merchant: 'Hotel Taj', category: 'Food', description: 'Client dinner', amount: 4800, currency: 'INR', tags: ['client-meeting'], paymentMethod: 'Reimbursement', status: 'Approved' },
    { id: 1, employeeName: 'Employee User', date: '2024-12-10', merchant: 'AWS', category: 'Software', description: 'Monthly server costs', amount: 35000, currency: 'INR', tags: ['cloud', 'infra'], paymentMethod: 'Corporate Card', status: 'Approved' },
    { id: 103, employeeName: 'Jane Doe', date: '2024-12-10', merchant: 'Starbucks', category: 'Food', description: 'Coffee with team', amount: 450, currency: 'INR', tags: ['team'], paymentMethod: 'Reimbursement', status: 'Rejected' },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  // Signal to hold the claim being edited
  expenseToEdit = signal<ExpenseClaim | null>(null);

  getExpenses() {
    return this.claims();
  }
  
  getExpenseById(id: number): ExpenseClaim | undefined {
    return this.claims().find(claim => claim.id === id);
  }

  setExpenseToEdit(expense: ExpenseClaim | null) {
    this.expenseToEdit.set(expense);
  }

  submitExpense(newClaimData: Omit<ExpenseClaim, 'id' | 'status' | 'employeeName'>) {
    const newClaim: ExpenseClaim = {
      ...newClaimData,
      employeeName: 'Employee User', // Hardcoded for simplicity
      id: Date.now(), // Use a more unique ID
      status: 'Pending'
    };
    this.claims.update(claims => [newClaim, ...claims].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }
  
  updateExpense(updatedClaim: ExpenseClaim) {
    this.claims.update(claims => 
      claims.map(claim => 
        claim.id === updatedClaim.id ? updatedClaim : claim
      )
    );
  }

  approveExpense(id: number) {
    this.claims.update(claims => 
      claims.map(claim => 
        claim.id === id ? { ...claim, status: 'Approved' } : claim
      )
    );
  }

  rejectExpense(id: number) {
     this.claims.update(claims => 
      claims.map(claim => 
        claim.id === id ? { ...claim, status: 'Rejected' } : claim
      )
    );
  }
}