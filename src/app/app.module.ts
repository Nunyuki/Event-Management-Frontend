import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { UserService } from './services/user.service';
import { AllCategoryEventComponent } from './all-category-event/all-category-event.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CategoryService } from './services/category.service';
import { EventService } from './services/event.service';
import { CreateEventComponent } from './create-event/create-event.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AllCategoryEventComponent,
    MainPageComponent,
    CreateEventComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    UserService,
    CategoryService,
    EventService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
