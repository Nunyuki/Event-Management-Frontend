import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    if (currentUser) {
      console.log('L\'utilisateur est déjà connecté', currentUser);
      this.router.navigate(['/mainPage']);
    }
  }
}