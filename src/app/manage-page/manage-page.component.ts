import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EventService } from '../services/event.service';
import { Event } from '../data/event';
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
  events: any[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private eventService: EventService, private userService: UserService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  toggleDisplay: (mode: string) => void = (mode: string) => {
    this.displayMode = mode;
    this.events = [];
    if (this.user !== null) {
      if (mode === 'inscriptions') {
        this.eventService.getEventsByRegistration(this.user.id).subscribe({
          next: (data: any) => {
            console.log('Evénements récupérés par inscription', data);
            this.events = data;
          },
          error: (error) => {
            console.error('Erreur dans la récupération des événements', error);
          }
        });
      } else if (mode === 'events') {
        this.eventService.searchEvents(this.user.pseudo, 'creator').subscribe({
          next: (data: any) => {
            console.log('Evénements récupérés créés par l\'utilisateur', data);
            this.events = data;
          },
          error: (error) => {
            console.error('Erreur dans la récupération des événements', error);
          }
        });
      }
    }  
  }

  formatDate(dateArray: string[]): string {
    const [year, month, day, hour, minute] = dateArray.map(Number);
    const date = new Date(year, month - 1, day, hour, minute);
    return format(date, "EEEE d MMMM yyyy HH:mm", { locale: fr });
  }

  redirectToEventPage(event: Event): void {
    this.router.navigate(['/eventPage'], { queryParams: { eventId: event.id } });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}