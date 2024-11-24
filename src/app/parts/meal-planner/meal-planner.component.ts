import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { animate, style, transition, trigger } from '@angular/animations';
import { jsPDF } from 'jspdf';

interface Meal {
  id: number;
  name: string;
  calories: number;  // Include calories in the Meal interface
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
  userMeals: Meal[] = [];
  daysOfWeek: string[] = [];
  weekRange: string = '';
  currentDate: Date = new Date();
  plannedMeals: { [key: string]: Meal[] } = {};
  connectedLists: string[] = [];
  categoryMenuVisible: boolean = false;
  activeCategory: string = 'default';
  filteredMeals: Meal[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMeals();
    this.fetchUserMeals();
    this.updateCalendar();

    document.addEventListener('mousedown', (event) => {
      if ((event.target as HTMLElement).classList.contains('cdk-drag')) {
        event.preventDefault(); // Prevent default text selection
      }
    });
  }

  // Sort both default and user meals alphabetically
  sortMeals() {
    this.meals.sort((a, b) => a.name.localeCompare(b.name));
    this.userMeals.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Filter meals based on search term
  filterRecipes() {
    this.filteredMeals = this.meals.filter(meal =>
      meal.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredMeals.sort((a, b) => a.name.localeCompare(b.name));  // Sort filtered meals alphabetically
  }

  // Toggle category menu visibility
  toggleCategoryMenu() {
    this.categoryMenuVisible = !this.categoryMenuVisible;
  }

  // Select category to filter meals
  selectCategory(category: string) {
    this.activeCategory = category;
    this.categoryMenuVisible = false;

    if (category === 'default') {
      this.filteredMeals = [...this.meals];
    } else if (category === 'user') {
      this.filteredMeals = [...this.userMeals];
    }
    this.filteredMeals.sort((a, b) => a.name.localeCompare(b.name));  // Sort meals after category change
  }

  // Fetch meals from the server
  fetchMeals() {
    this.http.get<{ status: string; data: Meal[] }>('http://localhost/api/api.php')
      .subscribe(
        response => {
          if (response.status === 'success') {
            this.meals = response.data;
            this.filteredMeals = [...this.meals];
            this.sortMeals();  // Sort meals alphabetically
          }
        },
        error => {
          console.error('Error fetching meals:', error);
        }
      );
  }

  // Fetch user meals from the server
  fetchUserMeals() {
    this.http.get<{ status: string; data: Meal[] }>('http://localhost/api/meal.php')
      .subscribe(
        response => {
          if (response.status === 'success') {
            this.userMeals = response.data;
            this.sortMeals();  // Sort user meals alphabetically
          }
        },
        error => {
          console.error('Error fetching user recipes:', error);
        }
      );
  }

  // Get the start and end date of the week
  getWeekDates(date: Date) {
    const startDate = date.getDate() - date.getDay();
    const endDate = startDate + 6;

    const startOfWeek = new Date(date.setDate(startDate));
    const endOfWeek = new Date(date.setDate(endDate));

    return { startOfWeek, endOfWeek };
  }

  // Update calendar view for the week
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

  // Handle drop event for meal
  onDrop(event: CdkDragDrop<Meal[]>, day?: string) {
    if (event.previousContainer === event.container) {
      return;
    }

    const meal = event.previousContainer.data[event.previousIndex];

    if (day) {
      if (!this.plannedMeals[day].includes(meal)) {
        this.plannedMeals[day].push(meal);
      }
    }
  }

  // Navigate to the previous week
  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateCalendar();
  }

  // Navigate to the next week
  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateCalendar();
  }

  // Navigate to today's date
  goToToday() {
    this.currentDate = new Date();
    this.updateCalendar();
  }

  // Remove meal from a specific day
  removeMealFromDay(meal: Meal, day: string) {
    const index = this.plannedMeals[day].indexOf(meal);
    if (index !== -1) {
      this.plannedMeals[day].splice(index, 1);
    }
  }

  // Download meal plan as PDF
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
          doc.text(`- ${meal.name} (${meal.calories} kcal)`, 30, y);  // Include calories in the PDF
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
