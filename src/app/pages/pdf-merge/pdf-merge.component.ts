import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-pdf-merge',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pdf-merge.component.html',
  styleUrls: ['./pdf-merge.component.css']
})
export class PdfMergerComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  files: File[] = [];
  mergedPdf: Uint8Array | null = null;
  isDragOver = false;
  isMerging = false;

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(fileList: FileList) {
    const newFiles = Array.from(fileList).filter(file => {
      if (file.type !== 'application/pdf') {
        alert(`Skipping ${file.name}: Only PDF files are supported.`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert(`Skipping ${file.name}: File exceeds 10MB limit.`);
        return false;
      }
      
      if (this.files.some(f => f.name === file.name && f.size === file.size)) {
        alert(`Skipping ${file.name}: File already added.`);
        return false;
      }
      
      return true;
    });
    
    this.files = [...this.files, ...newFiles];
    this.mergedPdf = null;
  }

  moveFile(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index > 0) {
      [this.files[index], this.files[index - 1]] = [this.files[index - 1], this.files[index]];
    } else if (direction === 'down' && index < this.files.length - 1) {
      [this.files[index], this.files[index + 1]] = [this.files[index + 1], this.files[index]];
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.mergedPdf = null;
  }

  resetTool() {
    this.files = [];
    this.mergedPdf = null;
    if (this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async mergePdfs() {
    if (this.files.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }
    
    try {
      this.isMerging = true;
      this.mergedPdf = null;
      
      const mergedPdfDoc = await PDFDocument.create();
      
      for (const file of this.files) {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page: any) => mergedPdfDoc.addPage(page));
      }
      
      this.mergedPdf = await mergedPdfDoc.save();
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('An error occurred while merging the PDFs. Please try again.');
    } finally {
      this.isMerging = false;
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  downloadMergedPdf() {
    if (!this.mergedPdf) return;
    
    const blob = new Blob([this.mergedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}