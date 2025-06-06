import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfUnlockService {
  private apiUrl = 'https://pdfunlocker-i7as.onrender.com/api/unlock';

  constructor(private http: HttpClient) { }

  unlockPdf(file: File, password: string): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    return this.http.post(this.apiUrl, formData, {
      responseType: 'blob'
    });
  }
}