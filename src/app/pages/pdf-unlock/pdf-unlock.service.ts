import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, delayWhen, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfUnlockService {
  private apiUrl = 'https://pdfunlocker-i7as.onrender.com/api/unlock';

  constructor(private http: HttpClient) {}

  unlockPdf(file: File, password: string): Observable<Blob> {
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
          delayWhen(() => timer(2000)) // wait 2 seconds before each retry
        )
      ),
      catchError(err => throwError(() => err))
    );
  }
}
