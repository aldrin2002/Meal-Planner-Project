import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { animate, style, transition, trigger } from '@angular/animations';
import { jsPDF } from 'jspdf';

interface Meal {
  id: number;
  name: string;
}

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.scss'],
  animations: [
    trigger('dragMove', [
      transition('* => *', [
        style({ transform: 'scale(1)', opacity: 0.8 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class MealPlannerComponent implements OnInit {
  meals: Meal[] = [];
  daysOfWeek: string[] = [];
  weekRange: string = '';
  currentDate: Date = new Date();
  plannedMeals: { [key: string]: Meal[] } = {};
  connectedLists: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMeals();
    this.updateCalendar();
     // Prevent text selection globally
  document.addEventListener('mousedown', (event) => {
    if ((event.target as HTMLElement).classList.contains('cdk-drag')) {
      event.preventDefault(); // Prevent default text selection
    }
  });

  }
  

  fetchMeals() {
    this.http.get<{ status: string; data: Meal[] }>('http://localhost/api/api.php')
      .subscribe(
        response => {
          if (response.status === 'success') {
            this.meals = response.data;
            this.sortMeals();
          }
        },
        error => {
          console.error('Error fetching meals:', error);
        }
      );
  }

  sortMeals() {
    this.meals.sort((a, b) => a.name.localeCompare(b.name));
  }

  getWeekDates(date: Date) {
    const startDate = date.getDate() - date.getDay();
    const endDate = startDate + 6;

    const startOfWeek = new Date(date.setDate(startDate));
    const endOfWeek = new Date(date.setDate(endDate));

    return { startOfWeek, endOfWeek };
  }

  updateCalendar() {
    const { startOfWeek, endOfWeek } = this.getWeekDates(new Date(this.currentDate));

    this.weekRange = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    this.daysOfWeek = [];
    this.connectedLists = ['recipesList'];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dayStr = day.toDateString();

      this.daysOfWeek.push(dayStr);
      if (!this.plannedMeals[dayStr]) this.plannedMeals[dayStr] = [];
      this.connectedLists.push(dayStr);
    }
  }

  onDrop(event: CdkDragDrop<Meal[]>, day?: string) {
    if (event.previousContainer === event.container) {
      return;
    }

    if (day) {
      const meal = event.previousContainer.data[event.previousIndex];
      if (!this.plannedMeals[day].includes(meal)) {
        this.plannedMeals[day].push(meal);
        event.previousContainer.data.splice(event.previousIndex, 1);
      }
    } else {
      const meal = event.previousContainer.data[event.previousIndex];
      if (!this.meals.includes(meal)) {
        this.meals.push(meal);
        event.previousContainer.data.splice(event.previousIndex, 1);
        this.sortMeals();
      }
    }
  }

  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateCalendar();
  }

  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.updateCalendar();
  }

  removeMealFromDay(meal: Meal, day: string) {
    const index = this.plannedMeals[day].indexOf(meal);
    if (index !== -1) {
      this.plannedMeals[day].splice(index, 1);
      this.meals.push(meal);
      this.sortMeals();
    }
  }

  downloadPDF() {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text('Meal Planner for the Week', 20, y);
    y += 10;

    this.daysOfWeek.forEach(day => {
      doc.setFontSize(12);
      doc.text(day, 20, y);
      y += 6;

      if (this.plannedMeals[day]?.length) {
        this.plannedMeals[day].forEach(meal => {
          doc.text(`- ${meal.name}`, 30, y);
          y += 6;
        });
      } else {
        doc.text('- No meal planned', 30, y);
        y += 6;
      }
      y += 6;
    });

    doc.save('meal-planner.pdf');
  }
}
