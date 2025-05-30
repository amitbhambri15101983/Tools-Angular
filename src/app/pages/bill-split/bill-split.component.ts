import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupListComponent } from './group-list/group-list.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';

@Component({
  selector: 'app-bill-split',
  standalone: true,
  imports: [CommonModule, FormsModule, GroupListComponent, BillDetailsComponent],
  templateUrl: './bill-split.component.html',
  styleUrls: ['./bill-split.component.css']
})
export class BillSplitComponent {
  @ViewChild(GroupListComponent) groupListComponent!: GroupListComponent;
  view: 'group' | 'bill' = 'group';
  selectedGroupId: string | null = null;

  onGroupSelected(groupId: string) {
    this.selectedGroupId = groupId;
    this.view = 'bill';
  }

  async onBackToGroups() {
    this.view = 'group';
    this.selectedGroupId = null;
    
    // Refresh groups with a small delay to ensure DOM is updated
    setTimeout(async () => {
      if (this.groupListComponent) {
        await this.groupListComponent.refreshGroups();
      }
    }, 100);
  }
}