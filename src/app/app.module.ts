import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EventPageComponent } from './event-page/event-page.component';

import { UserService } from './services/user.service';
import { AllCategoryEventComponent } from './all-category-event/all-category-event.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CategoryService } from './services/category.service';
import { EventService } from './services/event.service';
import { CreateEventComponent } from './create-event/create-event.component';
import { RegistrationService } from './services/registration.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AllCategoryEventComponent,
    MainPageComponent,
    CreateEventComponent,
    EventPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    BrowserAnimationsModule,
  ],
  providers: [
    UserService,
    CategoryService,
    EventService,
    RegistrationService,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    provideAnimationsAsync() 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }