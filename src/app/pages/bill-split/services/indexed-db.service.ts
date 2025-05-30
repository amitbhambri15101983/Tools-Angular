// src/app/core/services/indexed-db.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'BillSplitterDB';
  private readonly STORE_NAME = 'groups';
  private readonly DB_VERSION = 1;
  private isInitialized = false;

  async initDB(): Promise<void> {
    if (!this.isBrowser()) {
      return;
    }
  
    return new Promise(async (resolve, reject) => {
     
      const currentVersion = await this.getCurrentDBVersion();
      const request = indexedDB.open(this.DB_NAME, currentVersion + 1);
  
      // Event handlers
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create store if it doesn't exist
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          
        }
      };
  
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        resolve();
      };
  
      request.onerror = (event: Event) => {
        const error = (event.target as IDBRequest).error;
        reject(error);
      };
  
      request.onblocked = () => {
        reject("Database blocked");
      };
    });
  }

  private async getCurrentDBVersion(): Promise<number> {
    return new Promise((resolve) => {
      const versionRequest = indexedDB.open(this.DB_NAME);
      versionRequest.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const currentVersion = db.version;
        db.close();
        resolve(currentVersion);
      };
      versionRequest.onerror = () => resolve(0);
    });
  }
  
  async getGroups(): Promise<any[]> {
    if (!this.isBrowser()) return [];
    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    });
  }

  async saveGroup(group: any): Promise<void> {
    
    if (!this.isBrowser()) return;
    
    await this.ensureDBReady();
   
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(group);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as any).error);
    });
  }

  async getGroup(id: string): Promise<any> {
    if (!this.isBrowser()) return null;
    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as any).error);
    });
  }

  async deleteGroup(id: string): Promise<void> {
    if (!this.isBrowser()) return;
    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as any).error);
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
  }

  async ensureDBReady() : Promise<void>{
    
    if (!this.isInitialized) {
     
      await this.initDB();
      
    }
   
  }

  // Add this for development/testing
async resetDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(this.DB_NAME);
    deleteRequest.onsuccess = () => {
     
      this.isInitialized = false;
      this.db = null;
      resolve();
    };
    deleteRequest.onerror = (event) => {
      reject(`Reset failed: ${(event.target as any).error}`);
    };
  });
}

  
}