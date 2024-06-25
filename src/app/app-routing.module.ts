import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AllCategoryEventComponent } from './all-category-event/all-category-event.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventPageComponent } from './event-page/event-page.component';

const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path:'login', component: LoginComponent },
  { path:'signup', component: SignupComponent },
  { path:'mainPage', component: MainPageComponent},
  { path:'allCategoryEvent', component: AllCategoryEventComponent },
  { path:'createEvent', component: CreateEventComponent },
  { path:'eventPage', component: EventPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
