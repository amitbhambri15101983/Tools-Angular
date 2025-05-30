import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  FormControl, 
  ReactiveFormsModule 
} from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Flight {
  airline: string;
  flightDate: string;
  departureCity: string;
  departureHour: string;
  departureMinute: string;
  departurePeriod: string;
  arrivalCity: string;
  arrivalHour: string;
  arrivalMinute: string;
  arrivalPeriod: string;
}

interface Hotel {
  city: string;
  hotel: string;
  roomCategory: string;
  numRooms: number;
  numNights: number;
}

interface ItineraryDay {
  day: string;
  plan: string;
}

interface AutoTableResult {
  finalY: number;
}

@Component({
  selector: 'app-flight-itinerary',
  templateUrl: './flight-itinerary.component.html',
  styleUrls: ['./flight-itinerary.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FlightItineraryComponent implements OnInit {
  flightForm!: FormGroup;
  showPreview = false;
  previewContent = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.flightForm = this.fb.group({
      travelAgency: ['MakeMyTrip'],
      travelerName: [''],
      dateOfTravel: [today],
      departureCity: [''],
      citiesCovered: [''],
      totalCost: [''],
      introText: [`Dear Mam/Sir,\n\nGreetings from [Travel Agency]!\n\nThank you for giving us the opportunity to plan and arrange your forthcoming holiday. Over the years, we have changed the way people travel.\n\nWith the promise to make your holiday an unforgettable experience, we would like to suggest the below package, based on your preferences. We hope you would enjoy your holiday as much as we enjoyed planning it for you. Feel free to recommend any changes to enhance your travel experience.`],
      packageInclusions: ['• Transfers\n• City tour'],
      mealPlan: ['With Breakfast'],
      packageExclusions: [`• Any further increase in the air fare due to an increase in the fuel Price, change in Government regulations, taxes, etc. charged by the airline will be borne by the passengers. [Travel Agency] will not be responsible for the same\n• Any increase in the rate of exchange leading to increase in surface transportation and land arrangements, which may come into effect prior to departure\n• The package does not include any expenses of personal nature, such as laundry, wines, mineral water, food, drinks and other things not mentioned in the itinerary\n• Tour package rates are not applicable during trade fair period or any other events in accommodating cities\n• Standard check-in time is 1400 hrs. And check-out time is 12 noon. Early check-in/late check-out is subject to availability`],
      flightDetails: this.fb.array([this.createFlight()]),
      hotelDetails: this.fb.array([this.createHotel()]),
      itineraryDays: this.fb.array([this.createDay()]),
      vehicleInfo: [''],
      paymentInfo: [`Online Transfer/Cash/Debit or Credit Card/NET Banking\n\nFull payment is required on confirmation of all services and before departure.`],
      contactInfo: [`We wish you a pleasant holiday and thank you for contacting [Travel Agency] for your travel needs.\nPlease get in touch with us for any further information. We assure you complete assistance with our best services.\n\nFor Detailed VISA Information: - http://www.makemytrip.com/holidays-international/visa-information.html\nDestination Guide: - http://www.makemytrip.com/travel-guide/`]
    });

    const travelAgencyControl = this.flightForm.get('travelAgency');
    const introTextControl = this.flightForm.get('introText');
    const packageExclusionsControl = this.flightForm.get('packageExclusions');
    const contactInfoControl = this.flightForm.get('contactInfo');
    
    if (travelAgencyControl && introTextControl && packageExclusionsControl && contactInfoControl) {
      travelAgencyControl.valueChanges.subscribe(value => {
        const introText = introTextControl.value;
        const packageExclusions = packageExclusionsControl.value;
        const contactInfo = contactInfoControl.value;
        
        if (introText) {
          introTextControl.setValue(introText.replace(/\[Travel Agency\]/g, value || 'MakeMyTrip'));
        }
        if (packageExclusions) {
          packageExclusionsControl.setValue(packageExclusions.replace(/\[Travel Agency\]/g, value || 'MakeMyTrip'));
        }
        if (contactInfo) {
          contactInfoControl.setValue(contactInfo.replace(/\[Travel Agency\]/g, value || 'MakeMyTrip'));
        }
      });
    }
  }

  // Flight Methods
  get flights(): FormArray {
    return this.flightForm.get('flightDetails') as FormArray;
  }

  createFlight(): FormGroup {
    return this.fb.group({
      airline: [''],
      flightDate: [new Date().toISOString().split('T')[0]],
      departureCity: [''],
      departureHour: ['08'],
      departureMinute: ['00'],
      departurePeriod: ['AM'],
      arrivalCity: [''],
      arrivalHour: ['10'],
      arrivalMinute: ['00'],
      arrivalPeriod: ['AM']
    });
  }

  addFlight(): void {
    this.flights.push(this.createFlight());
  }

  removeFlight(index: number): void {
    if (this.flights.length > 1) {
      this.flights.removeAt(index);
    }
  }

  // Hotel Methods
  get hotels(): FormArray {
    return this.flightForm.get('hotelDetails') as FormArray;
  }

  createHotel(): FormGroup {
    return this.fb.group({
      city: [''],
      hotel: [''],
      roomCategory: [''],
      numRooms: [1],
      numNights: [1]
    });
  }

  addHotel(): void {
    this.hotels.push(this.createHotel());
  }

  removeHotel(index: number): void {
    if (this.hotels.length > 1) {
      this.hotels.removeAt(index);
    }
  }

  // Itinerary Methods
  get days(): FormArray {
    return this.flightForm.get('itineraryDays') as FormArray;
  }

  createDay(): FormGroup {
    return this.fb.group({
      day: ['Day 1'],
      plan: ['Pick up from Airport, Bengaluru to Coorg, En-Route Nisargadham.']
    });
  }

  addDay(): void {
    this.days.push(this.fb.group({
      day: [`Day ${this.days.length + 1}`],
      plan: ['']
    }));
  }

  removeDay(index: number): void {
    if (this.days.length > 1) {
      this.days.removeAt(index);
      this.updateDayNumbers();
    }
  }

  updateDayNumbers(): void {
    this.days.controls.forEach((control, index) => {
      const dayControl = control.get('day');
      if (dayControl) {
        dayControl.setValue(`Day ${index + 1}`);
      }
    });
  }

  // Preview & PDF
  togglePreview(): void {
    this.showPreview = true;
    this.generatePreview();
    setTimeout(() => {
      const previewSection = document.getElementById('previewSection');
      if (previewSection) {
        window.scrollTo({ top: previewSection.offsetTop, behavior: 'smooth' });
      }
    }, 100);
  }

  closePreview(): void {
    this.showPreview = false;
  }

  generatePreview(): void {
    const formValue = this.flightForm.value;
    const agency = formValue.travelAgency || 'MakeMyTrip';
    
    // Format flight details
    let flightRows = '';
    (formValue.flightDetails || []).forEach((flight: Flight) => {
      flightRows += `
        <tr>
          <td>${flight.airline || 'Airline'}</td>
          <td>${flight.flightDate ? new Date(flight.flightDate).toLocaleDateString() : 'Date'}</td>
          <td>
            ${flight.departureCity || 'City'}
            <div class="flight-time">${flight.departureHour}:${flight.departureMinute} ${flight.departurePeriod}</div>
          </td>
          <td>
            ${flight.arrivalCity || 'City'}
            <div class="flight-time">${flight.arrivalHour}:${flight.arrivalMinute} ${flight.arrivalPeriod}</div>
          </td>
        </tr>
      `;
    });

    // Format hotel details
    let hotelRows = '';
    (formValue.hotelDetails || []).forEach((hotel: Hotel) => {
      hotelRows += `
        <tr>
          <td>${hotel.city || 'City'}</td>
          <td>${hotel.hotel || 'Hotel'}</td>
          <td>${hotel.roomCategory || 'Room'}</td>
          <td>${hotel.numRooms || 1}</td>
          <td>${hotel.numNights || 1}</td>
        </tr>
      `;
    });

    // Format itinerary
    let dayRows = '';
    (formValue.itineraryDays || []).forEach((day: ItineraryDay) => {
      dayRows += `
        <tr>
          <td>${day.day || 'Day'}</td>
          <td>${day.plan || 'Plan'}</td>
        </tr>
      `;
    });

    // Replace agency placeholders
    const introText = formValue.introText?.replace(/\[Travel Agency\]/g, agency) || '';
    const packageExclusions = formValue.packageExclusions?.replace(/\[Travel Agency\]/g, agency) || '';
    const contactInfo = formValue.contactInfo?.replace(/\[Travel Agency\]/g, agency) || '';

    this.previewContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #4361ee; margin-bottom: 5px;">${agency}</h2>
        <p style="font-weight: 500; font-size: 1.1rem;">${formValue.travelerName || 'Traveler'}'s Travel Itinerary</p>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Basic Information</h3>
        <p><strong>Date of Travel:</strong> ${formValue.dateOfTravel ? new Date(formValue.dateOfTravel).toLocaleDateString() : 'Date'}</p>
        <p><strong>City of Departure:</strong> ${formValue.departureCity || 'City'}</p>
        <p><strong>Cities Covered:</strong> ${formValue.citiesCovered || 'Cities'}</p>
        <p><strong>Total Package Cost:</strong> ${formValue.totalCost || 'Cost'} INR</p>
      </div>

      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; white-space: pre-line;">
        ${introText}
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Flight Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #e0e7ff; color: #4361ee;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Airline</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Date</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Departure From</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Arrival At</th>
            </tr>
          </thead>
          <tbody>${flightRows}</tbody>
        </table>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Hotel Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #e0e7ff; color: #4361ee;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">City</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Hotel</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Room Category</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">No. of Rooms</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">No. of Nights</th>
            </tr>
          </thead>
          <tbody>${hotelRows}</tbody>
        </table>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Package Inclusions</h3>
        <ul style="margin-left: 20px;">
          ${(formValue.packageInclusions || '').split('\n').filter((item: string) => item.trim()).map((item: string) => `<li>${item.trim().replace('•', '').trim()}</li>`).join('')}
        </ul>
        
        <h4 style="margin-top: 15px;">Meal Plan</h4>
        <p>${formValue.mealPlan || 'Not specified'}</p>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Daily Itinerary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #e0e7ff; color: #4361ee;">
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Day</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #dadce0;">Plan</th>
            </tr>
          </thead>
          <tbody>${dayRows}</tbody>
        </table>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Package Exclusions</h3>
        <ul style="margin-left: 20px;">
          ${packageExclusions.split('\n').filter((item: string) => item.trim()).map((item: string) => `<li>${item.trim().replace('•', '').trim()}</li>`).join('')}
        </ul>
      </div>
      
      <div class="preview-section" style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="color: #4361ee; border-bottom: 1px solid #dadce0; padding-bottom: 5px; margin-bottom: 15px;">Additional Information</h3>
        <p><strong>Vehicle:</strong> ${formValue.vehicleInfo || 'Not specified'}</p>
        
        <h4 style="margin-top: 15px;">Payment Information</h4>
        <p>${(formValue.paymentInfo || '').replace(/\n/g, '<br>')}</p>
        
        <h4 style="margin-top: 15px;">Contact Information</h4>
        <p>${contactInfo.replace(/\n/g, '<br>')}</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px; font-style: italic;">We wish you a pleasant holiday!</p>
    `;
  }

  generatePDF(): void {
    const formValue = this.flightForm.value;
    const agency = formValue.travelAgency || 'MakeMyTrip';
    const travelerName = formValue.travelerName || 'Traveler';
    
    // Create the jsPDF instance
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Travel Itinerary',
      subject: 'Flight and Hotel Itinerary',
      author: 'ToolKitPro',
      keywords: 'travel, itinerary, flight, hotel',
      creator: 'ToolKitPro'
    });

    // Set initial y position
    let yPos = 20;

    // Add agency and traveler name
    doc.setFontSize(18);
    doc.setTextColor(67, 97, 238);
    doc.text(agency, 105, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${travelerName}'s Travel Itinerary`, 105, yPos, { align: 'center' });
    yPos += 20;

    // Basic Information
    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Basic Information', 14, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date of Travel: ${formValue.dateOfTravel ? new Date(formValue.dateOfTravel).toLocaleDateString() : 'Date'}`, 14, yPos);
    yPos += 10;
    doc.text(`City of Departure: ${formValue.departureCity || 'City'}`, 14, yPos);
    yPos += 10;
    doc.text(`Cities Covered: ${formValue.citiesCovered || 'Cities'}`, 14, yPos);
    yPos += 10;
    doc.text(`Total Package Cost: ${formValue.totalCost || 'Cost'} INR`, 14, yPos);
    yPos += 20;

    // Introductory Text
    const introText = formValue.introText?.replace(/\[Travel Agency\]/g, agency) || '';
    doc.setFontSize(11);
    const introLines = doc.splitTextToSize(introText, 180);
    doc.text(introLines, 14, yPos);
    yPos += introLines.length * 7 + 10;

    // Flight Details
    const flightData = (formValue.flightDetails || []).map((flight: Flight) => [
      flight.airline || '',
      flight.flightDate ? new Date(flight.flightDate).toLocaleDateString() : '',
      `${flight.departureCity || ''} ${flight.departureHour}:${flight.departureMinute} ${flight.departurePeriod}`,
      `${flight.arrivalCity || ''} ${flight.arrivalHour}:${flight.arrivalMinute} ${flight.arrivalPeriod}`
    ]);
    
    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Flight Details', 14, yPos);
    yPos += 10;
    
    // Create flight table
    autoTable(doc, {
      startY: yPos,
      head: [['Airline', 'Date', 'Departure', 'Arrival']],
      body: flightData,
      headStyles: {
        fillColor: [224, 231, 255],
        textColor: [67, 97, 238]
      },
      theme: 'grid'
    });
    
    // Update position after table
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Hotel Details
    const hotelData = (formValue.hotelDetails || []).map((hotel: Hotel) => [
      hotel.city || '',
      hotel.hotel || '',
      hotel.roomCategory || '',
      hotel.numRooms.toString(),
      hotel.numNights.toString()
    ]);

    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Hotel Details', 14, yPos);
    yPos += 10;
    
    // Create hotel table
    autoTable(doc, {
      startY: yPos,
      head: [['City', 'Hotel', 'Room Category', 'No. of Rooms', 'No. of Nights']],
      body: hotelData,
      headStyles: {
        fillColor: [224, 231, 255],
        textColor: [67, 97, 238]
      },
      theme: 'grid'
    });
    
    // Update position after table
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Package Inclusions
    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Package Inclusions', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const inclusions = (formValue.packageInclusions || '').split('\n').filter((item: string) => item.trim());
    inclusions.forEach((item: string) => {
      doc.text(`• ${item.trim().replace('•', '').trim()}`, 20, yPos);
      yPos += 7;
    });
    
    doc.text(`Meal Plan: ${formValue.mealPlan || 'Not specified'}`, 14, yPos);
    yPos += 15;
    
    // Daily Itinerary
    const itineraryData = (formValue.itineraryDays || []).map((day: ItineraryDay) => [
      day.day || '',
      day.plan || ''
    ]);

    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Daily Itinerary', 14, yPos);
    yPos += 10;
    
    // Create itinerary table
    autoTable(doc, {
      startY: yPos,
      head: [['Day', 'Plan']],
      body: itineraryData,
      headStyles: {
        fillColor: [224, 231, 255],
        textColor: [67, 97, 238]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 150 }
      },
      theme: 'grid'
    });
    
    // Update position after table
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Package Exclusions
    const processedPackageExclusions = formValue.packageExclusions?.replace(/\[Travel Agency\]/g, agency) || '';
    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Package Exclusions', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const exclusions = processedPackageExclusions.split('\n').filter((item: string) => item.trim());
    exclusions.forEach((item: string) => {
      const cleanedItem = item.trim().replace('•', '').trim();
      const lines = doc.splitTextToSize(`• ${cleanedItem}`, 180);
      lines.forEach((line: string) => {
        doc.text(line, 20, yPos);
        yPos += 7;
      });
    });
    
    yPos += 10;
    
    // Additional Information
    doc.setFontSize(14);
    doc.setTextColor(67, 97, 238);
    doc.text('Additional Information', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Vehicle: ${formValue.vehicleInfo || 'Not specified'}`, 14, yPos);
    yPos += 10;
    
    // Payment Information
    doc.text('Payment Information:', 14, yPos);
    yPos += 10;
    const paymentLines = (formValue.paymentInfo || '').split('\n');
    paymentLines.forEach((line: string) => {
      if (line.trim()) {
        const textLines = doc.splitTextToSize(line.trim(), 170);
        textLines.forEach((textLine: string) => {
          doc.text(textLine, 20, yPos);
          yPos += 7;
        });
      }
    });
    
    yPos += 10;
    
    // Contact Information
    const processedContactInfo = formValue.contactInfo?.replace(/\[Travel Agency\]/g, agency) || '';
    doc.text('Contact Information:', 14, yPos);
    yPos += 10;
    const contactLines = processedContactInfo.split('\n');
    contactLines.forEach((line: string) => {
      if (line.trim()) {
        const textLines = doc.splitTextToSize(line.trim(), 170);
        textLines.forEach((textLine: string) => {
          doc.text(textLine, 20, yPos);
          yPos += 7;
        });
      }
    });
    
    // Footer
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('We wish you a pleasant holiday!', 105, doc.internal.pageSize.height - 20, { align: 'center' });
        
    // Save PDF
    doc.save(`${travelerName.replace(/\s+/g, '_')}_Travel_Itinerary.pdf`);
  }
}