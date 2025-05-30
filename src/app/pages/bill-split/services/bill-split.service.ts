// src/app/pages/bill-split/services/bill-split.service.ts
import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class BillSplitService {
  constructor(private idb: IndexedDbService) {}

  async initDB(): Promise<void> {
    return this.idb.initDB();
  }

  async getGroups(): Promise<any[]> {
    return this.idb.getGroups();
  }

  async saveGroup(group: any): Promise<void> {
    return this.idb.saveGroup(group);
  }

  async getGroup(id: string): Promise<any> {
    return this.idb.getGroup(id);
  }

  async deleteGroup(id: string): Promise<void> {
    return this.idb.deleteGroup(id);
  }
}