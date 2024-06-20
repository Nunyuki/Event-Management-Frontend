import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUser: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    if (this.currentUser) {
      console.log('L\'utilisateur est déjà connecté', this.currentUser);
      this.router.navigate(['/mainPage']);
    }
  }
}