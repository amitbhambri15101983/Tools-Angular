import { Component, HostListener, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-kids-math-util',
  templateUrl: './kids-math-util.component.html',
  styleUrls: ['./kids-math-util.component.css'],
  imports: [FormsModule, CommonModule]
})
export class KidsMathUtilComponent implements AfterViewInit{
  operation: string = 'add';
  digits: number = 2;
  questions: any[] = [];
  showResults: boolean = false;
  correctCount: number = 0;

  ngAfterViewInit(): void {

    if (typeof document !== 'undefined') {
      const verticalAd = document.querySelector('.ad-container.vertical') as HTMLElement;
      // your code here
      if (verticalAd) {
        if (window.innerWidth >= 992) {
          verticalAd.style.display = 'flex';
        } else {
          verticalAd.style.display = 'none';
        }
      }
    }

  }

  /*@HostListener('window:resize')
  handleAdVisibility() {
    const verticalAd = document.querySelector('.ad-container.vertical');
    if (verticalAd) {
      if (window.innerWidth >= 992) {
        verticalAd.style.display = 'flex';
      } else {
        verticalAd.style.display = 'none';
      }
    }
  } */

  getRandomNumber(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuestions() {
    this.questions = [];
    this.showResults = false;
    this.correctCount = 0;
    
    for (let i = 0; i < 5; i++) {
      let num1, num2, text, answer;
      const digits = parseInt(this.digits.toString());

      switch (this.operation) {
        case 'add':
          num1 = this.getRandomNumber(digits);
          num2 = this.getRandomNumber(digits);
          text = `${num1} + ${num2}`;
          answer = num1 + num2;
          break;
        case 'subtract':
          num1 = this.getRandomNumber(digits);
          num2 = this.getRandomNumber(digits);
          if (num1 < num2) [num1, num2] = [num2, num1];
          text = `${num1} - ${num2}`;
          answer = num1 - num2;
          break;
        case 'multiply':
          num1 = this.getRandomNumber(digits);
          num2 = this.getRandomNumber(digits);
          text = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        case 'divide':
          num2 = this.getRandomNumber(digits);
          answer = this.getRandomNumber(digits);
          num1 = num2 * answer;
          text = `${num1} ÷ ${num2}`;
          break;
        default:
          num1 = this.getRandomNumber(digits);
          num2 = this.getRandomNumber(digits);
          text = `${num1} + ${num2}`;
          answer = num1 + num2;
      }
      
      this.questions.push({
        text,
        answer,
        userAnswer: null,
        isCorrect: undefined
      });
    }
  }

  checkAnswers() {
    this.correctCount = 0;
    this.questions.forEach(question => {
      if (question.userAnswer === question.answer) {
        question.isCorrect = true;
        this.correctCount++;
      } else {
        question.isCorrect = false;
      }
    });
    
    this.showResults = true;
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}