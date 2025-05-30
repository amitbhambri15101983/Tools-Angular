import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-bill-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-bill-modal.component.html',
  styleUrls: ['./edit-bill-modal.component.css']
})
export class EditBillModalComponent implements OnChanges {
  @Input() show = false;
  @Input() bill: any = null;
  @Input() members: string[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  localBill = { amount: 0, paidBy: '', description: '' };

  ngOnChanges() {
    if (this.bill) {
      this.localBill = { ...this.bill };
    }
  }

  submit() {
    this.save.emit(this.localBill);
  }
}
