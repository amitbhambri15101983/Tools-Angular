import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

declare const pdfjsLib: any;


@Component({
  selector: 'app-pdf-to-word',
  templateUrl: './pdf-to-word.component.html',
  styleUrls: ['./pdf-to-word.component.css']
})
export class PdfToWordComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('selectFilesBtn') selectFilesBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('dropArea') dropArea!: ElementRef<HTMLDivElement>;
  @ViewChild('convertBtn') convertBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('downloadBtn') downloadBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('loadingSpinner') loadingSpinner!: ElementRef<HTMLDivElement>;
  @ViewChild('resultsSection') resultsSection!: ElementRef<HTMLDivElement>;
  @ViewChild('errorMessage') errorMessage!: ElementRef<HTMLDivElement>;
  @ViewChild('preserveLayout') preserveLayout!: ElementRef<HTMLInputElement>;
  @ViewChild('extractImages') extractImages!: ElementRef<HTMLInputElement>;
  @ViewChild('recognizeText') recognizeText!: ElementRef<HTMLInputElement>;
  @ViewChild('imageQuality') imageQuality!: ElementRef<HTMLInputElement>;
  @ViewChild('imageQualityValue') imageQualityValue!: ElementRef<HTMLSpanElement>;
  @ViewChild('imageSize') imageSize!: ElementRef<HTMLInputElement>;
  @ViewChild('imageSizeValue') imageSizeValue!: ElementRef<HTMLSpanElement>;
  @ViewChild('originalFileName') originalFileName!: ElementRef<HTMLDivElement>;
  @ViewChild('fileSize') fileSize!: ElementRef<HTMLDivElement>;
  @ViewChild('pageCount') pageCount!: ElementRef<HTMLDivElement>;
  @ViewChild('conversionTime') conversionTime!: ElementRef<HTMLDivElement>;
  
  currentFile: File | null = null;
  convertedDoc: Blob | null = null;
  mobileMenuOpen = false;
  

  constructor() {
    // Set PDF.js worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  }

  ngAfterViewInit() {
    this.initSliders();
  }

  initSliders() {
    this.imageQualityValue.nativeElement.textContent = this.imageQuality.nativeElement.value;
    this.imageSizeValue.nativeElement.textContent = this.imageSize.nativeElement.value;
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
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.showError('Please select a PDF file');
      return;
    }
    
    if (file.size > 25 * 1024 * 1024) {
      this.showError('File size too large. Maximum 25MB allowed.');
      return;
    }
    
    this.currentFile = file;
    this.convertBtn.nativeElement.disabled = false;
    
    this.originalFileName.nativeElement.textContent = file.name;
    this.fileSize.nativeElement.textContent = this.formatFileSize(file.size);
    
    this.getPageCount(file).then(count => {
      this.pageCount.nativeElement.textContent = count.toString();
    }).catch(err => {
      console.error('Error getting page count:', err);
      this.pageCount.nativeElement.textContent = 'Unknown';
    });
  }

  showError(message: string) {
    this.errorMessage.nativeElement.textContent = message;
    this.errorMessage.nativeElement.style.display = 'block';
    this.loadingSpinner.nativeElement.style.display = 'none';
    this.resultsSection.nativeElement.style.display = 'none';
    this.convertBtn.nativeElement.disabled = true;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    return pdf.numPages;
  }

  async convertToWord() {
    if (!this.currentFile) return;
    
    this.loadingSpinner.nativeElement.style.display = 'block';
    this.resultsSection.nativeElement.style.display = 'none';
    this.convertBtn.nativeElement.disabled = true;
    this.errorMessage.nativeElement.style.display = 'none';
    
    const startTime = new Date().getTime();
    const shouldPreserveLayout = this.preserveLayout.nativeElement.checked;
    
    try {
      const arrayBuffer = await this.currentFile.arrayBuffer();
      const pdfJsDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdfJsDoc.numPages;
      
      let wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <title>${this.currentFile.name.replace('.pdf', '')}</title>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.5; }
                .page { page-break-after: always; margin-bottom: 20px; }
                .text-block { margin-bottom: 10px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1, h2, h3 { color: #333; }
                h1 { font-size: 24px; margin-bottom: 15px; }
                h2 { font-size: 20px; margin-bottom: 12px; }
                h3 { font-size: 18px; margin-bottom: 10px; }
                ul { margin-bottom: 15px; padding-left: 20px; }
                li { margin-bottom: 5px; }
                .bold { font-weight: bold; }
                .italic { font-style: italic; }
                .underline { text-decoration: underline; }
                .center { text-align: center; }
            </style>
        </head>
        <body>
      `;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        wordContent += `<div class="page">`;
        
        if (shouldPreserveLayout) {
          // Improved layout preservation
          const lines: { [key: string]: any[] } = {};
          const tolerance = 5; // Tolerance for line grouping
          
          textContent.items.forEach((item: any) => {
            const y = Math.round(item.transform[5] / tolerance) * tolerance;
            if (!lines[y]) lines[y] = [];
            lines[y].push(item);
          });
          
          // Sort lines from top to bottom
          const sortedLines = Object.keys(lines).sort((a, b) => parseFloat(b) - parseFloat(a));
          
          for (const y of sortedLines) {
            const lineItems = lines[parseFloat(y)].sort((a, b) => a.transform[4] - b.transform[4]);
            let lineHtml = '<div class="text-block">';
            let currentFont = '';
            
            for (const item of lineItems) {
              // Preserve font styles
              const text = item.str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
              let style = '';
              
              // Detect bold/italic from font name
              if (item.fontName) {
                const isBold = item.fontName.toLowerCase().includes('bold');
                const isItalic = item.fontName.toLowerCase().includes('italic');
                
                if (isBold) style += 'font-weight:bold;';
                if (isItalic) style += 'font-style:italic;';
              }
              
              // Preserve font size
              if (item.height) {
                style += `font-size:${item.height}px;`;
              }
              
              // Preserve text color
              if (item.color && item.color.length === 3) {
                const [r, g, b] = item.color.map((c: number) => Math.round(c * 255));
                style += `color:rgb(${r},${g},${b});`;
              }
              
              lineHtml += `<span style="${style}">${text}</span> `;
            }
            
            wordContent += lineHtml + '</div>';
          }
        } else {
          // Simple text extraction without layout preservation
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          wordContent += `<p>${pageText}</p>`;
        }
        
        wordContent += `</div>`; // Close page div
      }
      
      wordContent += `</body></html>`;
      
      const blob = new Blob([wordContent], { type: 'application/msword' });
      this.convertedDoc = blob;
      
      const endTime = new Date().getTime();
      this.conversionTime.nativeElement.textContent = ((endTime - startTime) / 1000).toFixed(2) + ' seconds';
      this.pageCount.nativeElement.textContent = numPages.toString();
      
      this.resultsSection.nativeElement.style.display = 'block';
    } catch (error: any) {
      this.showError('Conversion failed: ' + error.message);
      console.error('Conversion error:', error);
    } finally {
      this.loadingSpinner.nativeElement.style.display = 'none';
      this.convertBtn.nativeElement.disabled = false;
    }
  }

  downloadWordDoc() {
    if (!this.convertedDoc || !this.currentFile) return;
    
    const url = URL.createObjectURL(this.convertedDoc);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentFile.name.replace('.pdf', '') + '.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  updateImageQuality(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.imageQualityValue.nativeElement.textContent = value;
  }

  updateImageSize(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.imageSizeValue.nativeElement.textContent = value;
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
    this.dropArea.nativeElement.style.backgroundColor = 'rgba(26, 115, 232, 0.1)';
    this.dropArea.nativeElement.style.borderColor = '#4361ee';
  }

  unhighlightDropArea() {
    this.dropArea.nativeElement.style.backgroundColor = '#e0e7ff';
    this.dropArea.nativeElement.style.borderColor = '#4361ee';
  }
}