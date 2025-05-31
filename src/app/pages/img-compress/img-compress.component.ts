import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-img-compress',
  templateUrl: './img-compress.component.html',
  styleUrls: ['./img-compress.component.css']
})
export class ImgCompressComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('originalImage') originalImage!: ElementRef<HTMLImageElement>;
  @ViewChild('compressedImage') compressedImage!: ElementRef<HTMLImageElement>;
  @ViewChild('qualityValue') qualityValue!: ElementRef<HTMLElement>;
  @ViewChild('sizeValue') sizeValue!: ElementRef<HTMLElement>;
  @ViewChild('resultsSection') resultsSection!: ElementRef<HTMLElement>;
  @ViewChild('originalSize') originalSize!: ElementRef<HTMLElement>;
  @ViewChild('compressedSize') compressedSize!: ElementRef<HTMLElement>;
  @ViewChild('reductionPercent') reductionPercent!: ElementRef<HTMLElement>;
  @ViewChild('reductionBar') reductionBar!: ElementRef<HTMLElement>;
  @ViewChild('dimensions') dimensions!: ElementRef<HTMLElement>;
  @ViewChild('formatInfo') formatInfo!: ElementRef<HTMLElement>;
  @ViewChild('loadingSpinner') loadingSpinner!: ElementRef<HTMLElement>;
  @ViewChild('errorMessage') errorMessage!: ElementRef<HTMLElement>;
  
  constructor(private renderer: Renderer2) {}

  currentFile: File | null = null;
  currentFormat = 'original';
  compressedBlob: Blob | null = null;
  quality = 80;
  maxSize = 2000;
  mobileMenuOpen = false;

  ngAfterViewInit() {
    this.initSliders();
    //this.initFormatOptions();
  }

  setFormat(format: string) {
    this.currentFormat = format;
    if (this.currentFile) this.compressImage();
  }

  initSliders() {
    this.qualityValue.nativeElement.textContent = this.quality.toString();
    this.sizeValue.nativeElement.textContent = this.maxSize === 2000 ? 'Original' : `${this.maxSize}px`;
  }

  initFormatOptions() {
    const formatOptions = document.querySelectorAll('.format-option');
    formatOptions.forEach((option: Element) => {
      option.addEventListener('click', () => {
        formatOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.currentFormat = (option as HTMLElement).dataset['format'] || 'original';
        if (this.currentFile) this.compressImage();
      });
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    this.errorMessage.nativeElement.style.display = 'none';
    this.errorMessage.nativeElement.textContent = '';
    
    if (!file.type.match('image.*')) {
      this.showError('Please select an image file (JPG, PNG, or WebP)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      this.showError('File size too large. Please select an image smaller than 10MB.');
      return;
    }
    
    this.currentFile = file;
    this.displayOriginalImage(file);
    this.compressImage();
  }

  showError(message: string) {
    this.errorMessage.nativeElement.textContent = message;
    this.errorMessage.nativeElement.style.display = 'block';
    this.loadingSpinner.nativeElement.style.display = 'none';
    this.resultsSection.nativeElement.style.display = 'none';
  }

  displayOriginalImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.originalImage.nativeElement.src = e.target?.result as string;
      
      const sizeInKB = (file.size / 1024).toFixed(2);
      this.originalSize.nativeElement.textContent = `${sizeInKB} KB`;
      
      const img = new Image();
      img.onload = () => {
        this.dimensions.nativeElement.textContent = `${img.width} × ${img.height} px`;
      };
      img.onerror = () => {
        this.showError('Error loading image. Please try another file.');
      };
      img.src = e.target?.result as string;
      
      const format = file.name.split('.').pop()?.toUpperCase() || 'Unknown';
      this.formatInfo.nativeElement.textContent = format;
    };
    reader.onerror = () => {
      this.showError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file); // File is a subclass of Blob, so this is safe
  }

  compressImage() {
    if (!this.currentFile) return;
    
    this.loadingSpinner.nativeElement.style.display = 'block';
    this.resultsSection.nativeElement.style.display = 'none';
    this.errorMessage.nativeElement.style.display = 'none';
    
    setTimeout(() => {
      try {
        this.performCompression();
      } catch (error: any) {
        this.showError('Error during compression: ' + error.message);
        console.error('Compression error:', error);
      } finally {
        this.loadingSpinner.nativeElement.style.display = 'none';
      }
    }, 100);
  }

  performCompression() {
    if (!this.currentFile) return;

    const quality = this.quality / 100;
    const maxSize = this.maxSize === 2000 ? null : this.maxSize;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (maxSize && (width > maxSize || height > maxSize)) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          this.showError('Canvas context not available');
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        let mimeType = 'image/jpeg';
        if (this.currentFormat === 'png') mimeType = 'image/png';
        if (this.currentFormat === 'webp') mimeType = 'image/webp';
        
        canvas.toBlob((blob) => {
          if (!blob) {
            this.showError('Compression failed. Please try again.');
            return;
          }
          
          this.compressedBlob = blob;
          const compressedUrl = URL.createObjectURL(blob);
          this.compressedImage.nativeElement.src = compressedUrl;
          
          const originalSizeBytes = this.currentFile!.size;
          const compressedSizeBytes = blob.size;
          const reduction = ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes * 100).toFixed(2);
          
          this.compressedSize.nativeElement.textContent = `${(compressedSizeBytes / 1024).toFixed(2)} KB`;
          this.reductionPercent.nativeElement.textContent = `${reduction}%`;
          this.reductionBar.nativeElement.style.width = `${reduction}%`;
          this.dimensions.nativeElement.textContent = `${width} × ${height} px`;
          
          const format = this.currentFormat === 'original' 
            ? this.currentFile!.name.split('.').pop()?.toUpperCase() || 'Unknown'
            : this.currentFormat.toUpperCase();
          this.formatInfo.nativeElement.textContent = format;
          
          if (parseFloat(reduction) > 50) {
            this.reductionBar.nativeElement.style.backgroundColor = '#4cc9f0';
          } else if (parseFloat(reduction) > 20) {
            this.reductionBar.nativeElement.style.backgroundColor = '#4361ee';
          } else {
            this.reductionBar.nativeElement.style.backgroundColor = '#f44336';
          }
          
          this.resultsSection.nativeElement.style.display = 'block';
        }, mimeType, quality);
      };
      img.onerror = () => {
        this.showError('Error processing image. Please try another file.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      this.showError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(this.currentFile);
  }

  downloadCompressedImage() {
    if (!this.compressedBlob || !this.currentFile) return;
    
    const url = URL.createObjectURL(this.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${this.currentFile.name.split('.')[0]}.${this.getFileExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getFileExtension() {
    if (!this.currentFile) return '';
    if (this.currentFormat === 'original') {
      return this.currentFile.name.split('.').pop() || '';
    }
    return this.currentFormat === 'jpeg' ? 'jpg' : this.currentFormat;
  }

  updateQuality(event: Event) {
    this.quality = parseInt((event.target as HTMLInputElement).value);
    this.qualityValue.nativeElement.textContent = this.quality.toString();
    if (this.currentFile) this.compressImage();
  }

  updateSize(event: Event) {
    this.maxSize = parseInt((event.target as HTMLInputElement).value);
    this.sizeValue.nativeElement.textContent = this.maxSize === 2000 ? 'Original' : `${this.maxSize}px`;
    if (this.currentFile) this.compressImage();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.unhighlightDropArea();
    
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.fileInput.nativeElement.files = files;
      this.handleFileSelect({ target: this.fileInput.nativeElement } as unknown as Event);
    }
  }

  highlightDropArea() {
    const dropArea = document.getElementById('dropArea');
    if (dropArea) {
      dropArea.style.backgroundColor = 'rgba(26, 115, 232, 0.1)';
      dropArea.style.borderColor = '#4361ee';
    }
  }

  unhighlightDropArea() {
    const dropArea = document.getElementById('dropArea');
    if (dropArea) {
      dropArea.style.backgroundColor = '#e0e7ff';
      dropArea.style.borderColor = '#4361ee';
    }
  }
}