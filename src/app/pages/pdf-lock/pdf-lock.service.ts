import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfLockService {
  private apiUrl = 'https://pdfunlocker-i7as.onrender.com/api/lock'; // Update with your production URL
  //private apiUrl = 'http://localhost:8080/api/lock';

  constructor(private http: HttpClient) { }

  lockPdf(file: File, password: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    
    return this.http.post(this.apiUrl, formData, {
      responseType: 'blob'
    });
  }
}