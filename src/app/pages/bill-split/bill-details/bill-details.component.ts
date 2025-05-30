import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillSplitService } from '../services/bill-split.service';

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.css']
})
export class BillDetailsComponent implements OnInit {
  @Input() groupId: string | null = null;
  @Output() back = new EventEmitter<void>();
  settlements: any[] = [];

  group: any = null;
  newBill = { amount: 0, paidBy: '', description: '' };
  currencySymbols: Record<string, string> = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$'
  };
  showEditModal = false;
  editingBill: any = null;

  constructor(private billService: BillSplitService) {}

 

  // Function to open edit modal
  openEditModal(bill: any) {
    this.editingBill = { ...bill };
    this.showEditModal = true;
  }

  // Function to close edit modal
  closeEditModal() {
    this.showEditModal = false;
    this.editingBill = null;
  }

  // Function to save edited bill
  async saveEditedBill() {
    if (!this.group || !this.editingBill) return;
    
    try {
      // Find and update the bill
      const index = this.group.bills.findIndex((b: any) => b.id === this.editingBill.id);
      if (index !== -1) {
        this.group.bills[index] = { ...this.editingBill };
        await this.billService.saveGroup(this.group);
      }
      this.calculateSettlements();
      this.closeEditModal();
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  }


  // Update ngOnInit to load settlements
  async ngOnInit() {
    if (this.groupId) {
      this.group = await this.billService.getGroup(this.groupId);
      this.calculateSettlements();
    }
  }

  async addBill() {
    if (!this.newBill.amount || !this.newBill.paidBy || !this.newBill.description || !this.group) return;

    const newBill = {
      id: Date.now().toString(),
      amount: this.newBill.amount,
      paidBy: this.newBill.paidBy,
      description: this.newBill.description,
      date: new Date().toLocaleDateString(),
      currency: this.group.currency
    };

    try {
      this.group.bills.push(newBill);
      await this.billService.saveGroup(this.group);
      this.newBill = { amount: 0, paidBy: '', description: '' };
      this.calculateSettlements();
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  }

  async deleteBill(id: string) {
    if (!this.group) return;
    try {
      this.group.bills = this.group.bills.filter((b: any) => b.id !== id);
      await this.billService.saveGroup(this.group);
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  }

  formatCurrency(val: number): string {
    return this.currencySymbols[this.group?.currency || 'INR'] + val.toFixed(2);
  }

  onBack() {
    this.back.emit();
  }
  
  
  
  // Add this to refresh when bills change
  ngOnChanges() {
    this.calculateSettlements();
  }

  // Add this method to calculate settlements
calculateSettlements() {
  if (!this.group || !this.group.members || !this.group.bills) {
    this.settlements = [];
    return;
  }

  const balances: { [key: string]: number } = {};
  
  // Initialize balances
  this.group.members.forEach((member: string) => {
    balances[member] = 0;
  });

  // Calculate net balances
  this.group.bills.forEach((bill: any) => {
    const amount = parseFloat(bill.amount);
    const share = amount / this.group.members.length;
    
    // Payer gets credited
    balances[bill.paidBy] += amount;
    
    // All members get debited
    this.group.members.forEach((member: string) => {
      balances[member] -= share;
    });
  });

  // Simplify debts
  const settlements = [];
  const membersWithBalances = Object.keys(balances)
    .map(member => ({ member, balance: balances[member] }))
    .sort((a, b) => a.balance - b.balance);

  while (membersWithBalances.length > 1) {
    const debtor = membersWithBalances[0];
    const creditor = membersWithBalances[membersWithBalances.length - 1];
    
    const amount = Math.min(-debtor.balance, creditor.balance);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount: amount
      });
    }

    debtor.balance += amount;
    creditor.balance -= amount;

    // Remove settled members
    if (Math.abs(debtor.balance) < 0.01) membersWithBalances.shift();
    if (Math.abs(creditor.balance) < 0.01) membersWithBalances.pop();
  }

  this.settlements = settlements;
}

// Then add to the component
async downloadPDF() {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`${this.group.name} Settlement Report`, 15, 15);
  
  // Bills table
  doc.setFontSize(12);
  doc.text('Bills:', 15, 25);
  
  const billData = this.group.bills.map((bill: any) => [
    bill.description,
    this.formatCurrency(bill.amount),
    bill.paidBy,
    bill.date
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Description', 'Amount', 'Paid By', 'Date']],
    body: billData
  });
  
  // Settlements
  const settlementY = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Settlements:', 15, settlementY);
  
  if (this.settlements.length === 0) {
    doc.text('No settlements needed - everything is balanced!', 20, settlementY + 10);
  } else {
    const settlementData = this.settlements.map(s => [
      s.from,
      s.to,
      this.formatCurrency(s.amount)
    ]);
    
    autoTable(doc, {
      startY: settlementY + 5,
      head: [['From', 'To', 'Amount']],
      body: settlementData
    });
  }
  
  // Save the PDF
  doc.save(`${this.group.name.replace(/\s+/g, '_')}_settlement.pdf`);
}

async deleteBill1(id: string) {
  if (!this.group || !confirm('Are you sure you want to delete this bill?')) return;
  
  try {
    // Filter out the deleted bill
    this.group.bills = this.group.bills.filter((b: any) => b.id !== id);
    await this.billService.saveGroup(this.group);
    
    // Recalculate settlements
    this.calculateSettlements();
  } catch (error) {
    console.error('Error deleting bill:', error);
  }
}
}