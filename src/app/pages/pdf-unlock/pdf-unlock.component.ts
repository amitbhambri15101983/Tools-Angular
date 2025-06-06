import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfUnlockService } from './pdf-unlock.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pdf-unlock',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pdf-unlock.component.html',
  styleUrls: ['./pdf-unlock.component.css']
})
export class PdfUnlockComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  currentFile: File | null = null;
  fileName = '';
  password = '';
  passwordVisible = false;
  isProcessing = false;
  progressValue = 0;
  unlockResult: { blobUrl: string, fileName: string } | null = null;
  errorMessage: string | null = null;
  activeFaqIndex: number | null = null;
  retryAttempt : number | null = null;

  constructor(private pdfUnlockService: PdfUnlockService) {}

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please upload a PDF file';
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      this.errorMessage = 'File size exceeds 50MB limit';
      return;
    }

    this.currentFile = file;
    this.fileName = file.name;
    this.errorMessage = null;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  unlockPdf(): void {
    if (!this.currentFile) {
      this.errorMessage = 'Please upload a PDF file';
      return;
    }
  
    this.isProcessing = true;
    this.progressValue = 0;
    this.unlockResult = null;
    this.errorMessage = null;
    this.retryAttempt = 0; // Track retry attempts
  
    const progressInterval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += 2;
      }
    }, 300);
  
    this.pdfUnlockService.unlockPdf(this.currentFile, this.password).subscribe({
      next: (blob: Blob) => {
        clearInterval(progressInterval);
        this.progressValue = 100;
  
        const blobUrl = URL.createObjectURL(blob);
        const fileName = this.currentFile?.name.replace('.pdf', '_unlocked.pdf') || 'unlocked.pdf';
  
        this.unlockResult = { blobUrl, fileName };
        this.isProcessing = false;
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isProcessing = false;
  
        if (err.status === 0) {
          this.errorMessage = 'The server may be starting. Please wait a few seconds and try again.';
        } else if (err.status === 401) {
          this.errorMessage = 'Incorrect password.';
        } else {
          this.errorMessage = 'Error unlocking PDF. Please try again.';
        }
  
        console.error('Unlock error:', err);
      }
    });
  }
  

  resetTool(): void {
    this.currentFile = null;
    this.fileName = '';
    this.password = '';
    this.unlockResult = null;
    this.errorMessage = null;
    this.progressValue = 0;
    this.fileInput.nativeElement.value = '';
  }

  preventDefaults(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}