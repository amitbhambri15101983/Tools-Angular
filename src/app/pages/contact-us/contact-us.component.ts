import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  // Use encoded email to prevent Angular template errors
  formSubmitAction = 'https://formsubmit.co/amit.reply%40gmail.com';
  
  // Thank you page URL
  thankYouUrl = '/thank-you';
}