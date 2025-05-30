import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillSplitService } from '../services/bill-split.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  @Output() groupSelected = new EventEmitter<string>();

  groupName = '';
  newMember = '';
  newGroupMembers: string[] = [];
  groups: any[] = [];
  currencySymbols: Record<string, string> = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$'
  };

  constructor(
    private billService: BillSplitService,
    private cdr: ChangeDetectorRef
  ) {}
  

  async ngOnInit() {
    try {
      await this.billService.initDB();
      this.groups = await this.billService.getGroups();
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }

 

  addMember() {
    const name = this.newMember.trim();
    if (name && !this.newGroupMembers.includes(name)) {
      this.newGroupMembers.push(name);
      this.newMember = '';
    }
  }

  removeMember(member: string) {
    this.newGroupMembers = this.newGroupMembers.filter(m => m !== member);
  }

  async createGroup() {
    if (!this.groupName || this.newGroupMembers.length === 0) return;
    
    const newGroup = {
      id: Date.now().toString(),
      name: this.groupName,
      members: [...this.newGroupMembers],
      bills: [],
      currency: 'INR'
    };

    try {
      await this.billService.saveGroup(newGroup);
      this.groupName = '';
      this.newGroupMembers = [];
      await this.refreshGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  }

  openGroup(id: string) {
    this.groupSelected.emit(id);
  }

  async deleteGroup(id: string) {
    if (confirm('Are you sure you want to delete this group and all its bills?')) {
      try {
        await this.billService.deleteGroup(id);
        await this.refreshGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('Failed to delete group. Please try again.');
      }
    }
  }

  formatCurrency(group: any): string {
    const total = group.bills.reduce((sum: number, bill: any) => sum + bill.amount, 0);
    const symbol = this.currencySymbols[group.currency || 'INR'];
    return `${symbol}${total.toFixed(2)}`;
  }

  async refreshGroups() {
    try {
      this.groups = await this.billService.getGroups();
      this.cdr.detectChanges(); // Force UI update
    } catch (error) {
      console.error('Error refreshing groups:', error);
    }
  }
}