import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './parts/landing-page/landing-page.component';
import { MealPlannerComponent } from './parts/meal-planner/meal-planner.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    MealPlannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
