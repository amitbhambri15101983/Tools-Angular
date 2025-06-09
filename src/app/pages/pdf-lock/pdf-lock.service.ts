import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, delayWhen, scan } from 'rxjs/operators';

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
    }).pipe(
          retryWhen(errors =>
            errors.pipe(
              scan((retryCount, error) => {
                if (retryCount >= 2) {
                  throw error;
                }
                return retryCount + 1;
              }, 0),
              delayWhen(() => timer(3000)) // wait 3 seconds before each retry
            )
          ),
          catchError(err => throwError(() => err))
        );
  }
}