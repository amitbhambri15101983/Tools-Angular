import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PDFDocument } from 'pdf-lib';

interface ImageFile {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-image-to-pdf',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-to-pdf.component.html',
  styleUrls: ['./image-to-pdf.component.css']
})
export class ImageToPdfComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  images: ImageFile[] = [];
  generatedPdf: Uint8Array | null = null;
  isDragOver = false;
  isConverting = false;

  private readonly maxFiles = 20;
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];

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
    if (this.images.length >= this.maxFiles) {
      alert(`You can only add up to ${this.maxFiles} images.`);
      return;
    }

    const newFiles = Array.from(fileList)
      .filter(file => {
        if (!this.acceptedTypes.includes(file.type)) {
          alert(`Skipping ${file.name}: Only JPG, PNG and WEBP images are supported.`);
          return false;
        }

        if (file.size > this.maxFileSize) {
          alert(`Skipping ${file.name}: File exceeds 10MB limit.`);
          return false;
        }

        if (this.images.some(img => img.file.name === file.name && img.file.size === file.size)) {
          alert(`Skipping ${file.name}: File already added.`);
          return false;
        }

        return true;
      })
      .slice(0, this.maxFiles - this.images.length);

    newFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      this.images.push({ file, previewUrl });
    });

    this.generatedPdf = null;
  }

  moveFile(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index > 0) {
      [this.images[index], this.images[index - 1]] = [this.images[index - 1], this.images[index]];
    } else if (direction === 'down' && index < this.images.length - 1) {
      [this.images[index], this.images[index + 1]] = [this.images[index + 1], this.images[index]];
    }
  }

  removeFile(index: number) {
    URL.revokeObjectURL(this.images[index].previewUrl);
    this.images.splice(index, 1);
    this.generatedPdf = null;
  }

  resetTool() {
    this.images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    this.images = [];
    this.generatedPdf = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  async convertToPdf() {
    if (this.images.length < 1) {
      alert('Please select at least 1 image to convert.');
      return;
    }

    try {
      this.isConverting = true;
      this.generatedPdf = null;

      const pdfDoc = await PDFDocument.create();

      for (const image of this.images) {
        const arrayBuffer = await this.readFileAsArrayBuffer(image.file);

        let embeddedImage;
        if (image.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else if (image.file.type === 'image/webp') {
          // pdf-lib has no native WEBP support, so we re-encode via canvas first
          const jpegBuffer = await this.convertToJpegBuffer(image.file);
          embeddedImage = await pdfDoc.embedJpg(jpegBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height
        });
      }

      this.generatedPdf = await pdfDoc.save();
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('An error occurred while converting the images. Please try again.');
    } finally {
      this.isConverting = false;
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

  private convertToJpegBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error('Failed to convert WEBP to JPEG'));
            return;
          }
          resolve(await blob.arrayBuffer());
        }, 'image/jpeg', 0.92);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for conversion'));
      };

      img.src = url;
    });
  }

  downloadPdf() {
    if (!this.generatedPdf) return;

    const blob = new Blob([this.generatedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-images.pdf';
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
