import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './parts/landing-page/landing-page.component';
import { MealPlannerComponent } from './parts/meal-planner/meal-planner.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';  // Import AuthGuard

const routes: Routes = [
  { path: '', component: LoginComponent },  // Login route
  { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthGuard] },
  { path: 'meal-planner', component: MealPlannerComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
