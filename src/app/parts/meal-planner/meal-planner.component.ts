import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Meal {
  id: number;
  name: string;
}

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.scss']
})
export class MealPlannerComponent implements OnInit {
  meals: Meal[] = []; // List of meals
  daysOfWeek: string[] = []; // Days displayed in the planner
  weekRange: string = ''; // Week range displayed in the header
  currentDate: Date = new Date(); // Current date used to calculate week range
  plannedMeals: { [key: string]: Meal[] } = {}; // Meals planned per day

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMeals();
    this.updateCalendar();
  }

  fetchMeals() {
    this.http.get<{ status: string; data: Meal[] }>('http://localhost/api/api.php')
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            this.meals = response.data;
          }
        },
        (error) => {
          console.error('Error fetching meals:', error);
        }
      );
  }

  getWeekDates(date: Date) {
    const startDate = date.getDate() - date.getDay(); // Start of the week
    const endDate = startDate + 6; // End of the week

    const startOfWeek = new Date(date.setDate(startDate));
    const endOfWeek = new Date(date.setDate(endDate));

    return { startOfWeek, endOfWeek };
  }

  updateCalendar() {
    const { startOfWeek, endOfWeek } = this.getWeekDates(new Date(this.currentDate));

    const startDateStr = startOfWeek.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    const endDateStr = endOfWeek.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    this.weekRange = `${startDateStr} - ${endDateStr}`;

    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
      this.daysOfWeek.push(dayStr);

      // Initialize an empty array for each day in plannedMeals if it doesn't exist
      if (!this.plannedMeals[dayStr]) {
        this.plannedMeals[dayStr] = [];
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
    }
  }
}
