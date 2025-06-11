import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

declare const Tesseract: any;

@Component({
  selector: 'app-image-to-word',
  templateUrl: './image-to-word.component.html',
  styleUrls: ['./image-to-word.component.css']
})
export class ImageToWordComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;
  @ViewChild('textPreview') textPreview!: ElementRef<HTMLDivElement>;
  @ViewChild('progress') progress!: ElementRef<HTMLDivElement>;
  @ViewChild('statusText') statusText!: ElementRef<HTMLSpanElement>;
  @ViewChild('statusIndicator') statusIndicator!: ElementRef<HTMLDivElement>;
  
  currentImage: string | null = null;
  extractedText = '';
  showPreview = false;
  showTextPreview = false;
  showDownload = false;
  progressValue = 0;
  statusMessage = 'Ready to convert your image';
  statusType: 'info' | 'error' | 'success' | 'processing' = 'info';

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const convertBtn = document.getElementById('convertBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if (uploadArea) {
      uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
      uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    if (uploadButton) {
      uploadButton.addEventListener('click', this.handleUploadButtonClick.bind(this));
    }

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.addEventListener('change', this.handleImageUpload.bind(this));
    }

    if (convertBtn) {
      convertBtn.addEventListener('click', this.convertImageToWord.bind(this));
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', this.resetTool.bind(this));
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', this.downloadWordDocument.bind(this));
    }
  }

  handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
      uploadArea.style.borderColor = 'var(--primary)';
      uploadArea.style.backgroundColor = 'rgba(224, 231, 255, 0.7)';
    }
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
      uploadArea.style.borderColor = 'var(--medium-gray)';
      uploadArea.style.backgroundColor = '';
    }
    
    if (e.dataTransfer?.files.length) {
      this.processImageFile(e.dataTransfer.files[0]);
    }
  }

  handleUploadButtonClick(e: MouseEvent) {
    e.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  handleImageUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processImageFile(input.files[0]);
    }
  }

  processImageFile(file: File) {
    const fileType = file.type;
    
    if (!fileType.match('image.*')) {
      this.updateStatus('Please upload a valid image file (JPG, PNG, etc.)', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      this.updateStatus('File size exceeds 5MB limit. Please choose a smaller image.', 'error');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.imagePreview.nativeElement.src = e.target.result as string;
        this.showPreview = true;
        this.currentImage = e.target.result as string;
        this.updateStatus('Image uploaded successfully. Click "Convert to Word" to extract text.');
        
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) {
          convertBtn.classList.remove('btn-disabled');
          convertBtn.removeAttribute('disabled');
        }
      }
    };
    
    reader.onerror = () => {
      this.updateStatus('Error reading the file', 'error');
    };
    
    reader.readAsDataURL(file);
  }

  async convertImageToWord() {
    if (!this.currentImage) {
      this.updateStatus('Please upload an image first', 'error');
      return;
    }
    
    this.progressValue = 0;
    this.updateStatus('Processing image...', 'processing');
    
    try {
      // Simulate processing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150));
        this.progressValue = i;
      }
      
      // Use Tesseract.js for OCR
      this.updateStatus('Extracting text...', 'processing');
      
      const { data: { text } } = await Tesseract.recognize(
        this.currentImage,
        'eng',
        { logger: (m: any) => this.updateOCRProgress(m) }
      );
      
      this.extractedText = text;
      this.textPreview.nativeElement.textContent = text;
      this.showTextPreview = true;
      this.showDownload = true;
      
      this.updateStatus('Text extracted successfully! Click "Download Word Document" to save.', 'success');
    } catch (error) {
      console.error('OCR Error:', error);
      this.updateStatus('Error extracting text. Please try another image.', 'error');
    }
  }

  updateOCRProgress(message: any) {
    if (message.status === 'recognizing text') {
      const progressValue = Math.round(message.progress * 100);
      this.progressValue = progressValue;
      this.updateStatus(`Extracting text... ${progressValue}%`, 'processing');
    }
  }

  downloadWordDocument() {
    if (!this.extractedText) {
      this.updateStatus('No text to download. Please convert an image first.', 'error');
      return;
    }
    
    try {
      // Create a Blob with the text content
      const blob = new Blob([this.extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      
      a.href = url;
      a.download = `extracted-text-${dateStr}.doc`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      this.updateStatus('Word document downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      this.updateStatus('Error creating the document. Please try again.', 'error');
    }
  }

  updateStatus(message: string, type: 'info' | 'error' | 'success' | 'processing' = 'info') {
    this.statusMessage = message;
    this.statusType = type;
  }

  resetTool() {
    this.fileInput.nativeElement.value = '';
    this.imagePreview.nativeElement.src = '';
    this.textPreview.nativeElement.textContent = '';
    this.extractedText = '';
    this.currentImage = null;
    this.showPreview = false;
    this.showTextPreview = false;
    this.showDownload = false;
    this.progressValue = 0;
    this.updateStatus('Ready to convert your image');
    
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
      convertBtn.classList.add('btn-disabled');
      convertBtn.setAttribute('disabled', 'true');
    }
  }
}