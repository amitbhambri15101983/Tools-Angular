import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuActive = false; // Add this property

  toggleMobileMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMobileMenu() {
    this.isMenuActive = false;
  }
}
