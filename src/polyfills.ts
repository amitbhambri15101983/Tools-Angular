/***************************************************************************************************
 * APPLICATION IMPORTS
 */

// Add IndexedDB polyfill
if (typeof window !== 'undefined') {
    (window as any).indexedDB = (window as any).indexedDB || 
                                (window as any).mozIndexedDB || 
                                (window as any).webkitIndexedDB || 
                                (window as any).msIndexedDB;
    
    (window as any).IDBTransaction = (window as any).IDBTransaction || 
                                     (window as any).webkitIDBTransaction || 
                                     (window as any).msIDBTransaction;
    
    (window as any).IDBKeyRange = (window as any).IDBKeyRange || 
                                  (window as any).webkitIDBKeyRange || 
                                  (window as any).msIDBKeyRange;
  }