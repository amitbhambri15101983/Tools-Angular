import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery = '';
  searchResults: any[] = [];
  showSearchResults = false;
  
  tools = [
    {
      name: "Image Compressor",
      description: "Reduce image file size without losing quality",
      category: "Image Tools",
      url: "/img-compress"
    },
    {
      name: "Image Converter",
      description: "Convert between JPG, PNG, WEBP and more",
      category: "Image Tools",
      url: "#"
    },
    {
      name: "PDF to Word",
      description: "Convert PDF documents to editable Word files",
      category: "PDF Tools",
      url: "/pdf-to-word"
    },
    {
      name: "PDF Merge",
      description: "Merge PDF files",
      category: "PDF Tools",
      url: "/pdf-merge"
    },
    {
      name: "PDF Unlock",
      description: "Unlock PDF file",
      category: "PDF Tools",
      url: "/pdf-unlock"
    },
    {
      name: "PDF Lock",
      description: "Lock PDF file",
      category: "PDF Tools",
      url: "/pdf-lock"
    },
    {
      name: "Bill Splitter",
      description: "Easily split bills and calculate shares among friends",
      category: "Utility Tools",
      url: "/bill-split"
    },
    {
      name: "Kids Math Play",
      description: "Let the Kids Play and learn Maths Puzzels",
      category: "Utility Tools",
      url: "/kids-math-util"
    },
    {
      name: "Flight Itinerary",
      description: "Plan your travel itinerary and download as PDF",
      category: "Utility Tools",
      url: "/flight-itinerary"
    }
  ];

  constructor(private sanitizer: DomSanitizer, private router: Router) {}

  performSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    this.searchResults = [];
    this.showSearchResults = false;

    if (!query) return;

    this.searchResults = this.tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );

    this.showSearchResults = true;
  }

  highlightMatches(text: string): SafeHtml {
    if (!this.searchQuery.trim()) {
      return text;
    }
    const regex = new RegExp(this.escapeRegExp(this.searchQuery.trim()), 'gi');
    const highlightedText = text.replace(regex, match => `<span class="highlight">${match}</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  private escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  navigateTo(url: string) {
    this.showSearchResults = false;
    this.searchQuery = '';
    this.router.navigateByUrl(url);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const searchContainer = document.querySelector('.search-bar');
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
      this.showSearchResults = false;
    }
  }
}