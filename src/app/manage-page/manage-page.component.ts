import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { User } from '../data/user';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrl: './manage-page.component.css'
})
export class ManagePageComponent {

  displayMode: string = 'profil';
  user: User | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private eventService: EventService, private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  toggleDisplay: (mode: string) => void = (mode: string) => {
    this.displayMode = mode;
    if (mode === 'profil') {

    } else if (mode === 'inscriptions') {

    } else if (mode === 'evenements') {

    } else if (mode === 'logout') {

    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}
