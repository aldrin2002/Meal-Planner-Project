import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.scss'
})
export class MealPlannerComponent implements OnInit {
  currentDate: Date = new Date();
  weekRange: string = '';
  daysOfWeek: string[] = [];
   // Mock meal data
   meals = [
    { name: 'Spaghetti Bolognese' },
    { name: 'Chicken Caesar Salad' },
    { name: 'Beef Tacos' },
    { name: 'Vegetable Stir-fry' },
    { name: 'Chicken Alfredo' },
    { name: 'Fish Tacos' },
    { name: 'Mushroom Risotto' },
    { name: 'Pasta Primavera' }
  ];

  ngOnInit(): void {
    this.updateCalendar();
  }

  // Function to get the start and end date of the week
  getWeekDates(date: Date) {
    const startDate = date.getDate() - date.getDay(); // Start of the week (Sunday)
    const endDate = startDate + 6; // End of the week (Saturday)
    
    const startOfWeek = new Date(date.setDate(startDate));
    const endOfWeek = new Date(date.setDate(endDate));

    return { startOfWeek, endOfWeek };
  }

  // Function to update the calendar display
  updateCalendar() {
    const { startOfWeek, endOfWeek } = this.getWeekDates(new Date(this.currentDate));

    // Update the week range display
    const startDateStr = startOfWeek.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    const endDateStr = endOfWeek.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    this.weekRange = `${startDateStr} - ${endDateStr}`;

    // Generate the calendar days
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      this.daysOfWeek.push(day.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }

  // Event handlers for navigation buttons
  goToPreviousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7); // Go to the previous week
    this.updateCalendar();
  }

  goToNextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7); // Go to the next week
    this.updateCalendar();
  }

  goToToday() {
    this.currentDate = new Date(); // Reset to today's date
    this.updateCalendar();
  }

  selectMeal(meal: any) {
    console.log('Selected meal:', meal.name);
    // You can implement logic here for selecting a meal (e.g., add it to a plan)
  }

}

