import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfLockService } from './pdf-lock.service';

@Component({
  selector: 'app-pdf-lock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-lock.component.html',
  styleUrls: ['./pdf-lock.component.css']
})
export class PdfLockComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  currentFile: File | null = null;
  fileName = '';
  password = '';
  confirmPassword = '';
  passwordVisible = false;
  confirmPasswordVisible = false;
  isProcessing = false;
  progressValue = 0;
  lockResult: { blobUrl: string, fileName: string } | null = null;
  errorMessage: string | null = null;
  activeFaqIndex: number | null = null;

  constructor(private pdfLockService: PdfLockService) {}

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

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  lockPdf(): void {
    if (!this.currentFile) {
      this.errorMessage = 'Please upload a PDF file';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter a password';
      return;
    }

    this.isProcessing = true;
    this.progressValue = 0;
    this.lockResult = null;
    this.errorMessage = null;

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.progressValue < 95) {
        this.progressValue += 5;
      }
    }, 200);

    this.pdfLockService.lockPdf(this.currentFile, this.password).subscribe({
      next: (blob: Blob | MediaSource) => {
        clearInterval(progressInterval);
        this.progressValue = 100;
        
        const blobUrl = URL.createObjectURL(blob);
        const fileName = this.currentFile?.name.replace('.pdf', '_locked.pdf') || 'locked.pdf';
        
        this.lockResult = { blobUrl, fileName };
        this.isProcessing = false;
      },
      error: (err: any) => {
        clearInterval(progressInterval);
        this.isProcessing = false;
        this.errorMessage = 'Error locking PDF. Please try again.';
        console.error('Lock error:', err);
      }
    });
  }

  resetTool(): void {
    this.currentFile = null;
    this.fileName = '';
    this.password = '';
    this.confirmPassword = '';
    this.lockResult = null;
    this.errorMessage = null;
    this.progressValue = 0;
    this.fileInput.nativeElement.value = '';
  }

  preventDefaults(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}