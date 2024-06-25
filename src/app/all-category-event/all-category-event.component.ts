import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CategoryService } from '../services/category.service';
import { EventService } from '../services/event.service';
import { Category } from '../data/category';
import { Event } from '../data/event';

@Component({
  selector: 'app-all-category-event',
  templateUrl: './all-category-event.component.html',
  styleUrl: './all-category-event.component.css'
})
export class AllCategoryEventComponent {

  displayMode: string = 'categories';

  categories: Category[] = [];
  categoryRows: any[][] = [];

  events: any[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private categoryService: CategoryService, private eventService: EventService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['displayMode']) {
        this.displayMode = params['displayMode'];
      }
      this.loadData();
    });
  }

  loadData(): void {
    if (this.displayMode === 'categories') {
      this.categoryService.getCategories().subscribe({
        next: (data: Category[]) => {
          console.log('Catégories récupérées', data);
          this.categories = data;
          this.categoryRows = this.chunk(this.categories, 3);
        },
        error: (error) => {
          console.error('Erreur dans la récupération des catégories', error);
        }
      });
    } else {
      this.eventService.getEvents().subscribe({
        next: (data: any) => {
          console.log('Evénements récupérés', data);
          this.events = data;
        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });
    }
  }

  chunk(arr: any[], size: number): any[][] {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  }

  formatDate(dateArray: string[]): string {
    const [year, month, day, hour, minute] = dateArray.map(Number);
    const date = new Date(year, month - 1, day, hour, minute);
    return format(date, "EEEE d MMMM yyyy HH:mm", { locale: fr });
  }

  toggleDisplay: (mode: string) => void = (mode: string) => {
    this.displayMode = mode;
    if (mode === 'categories') {
      this.categoryService.getCategories().subscribe({
        next: (data: Category[]) => {
          console.log('Catégories récupérées', data)
          this.categories = data;
          this.categoryRows = this.chunk(this.categories, 3);
        },
        error: (error) => {
          console.error('Erreur dans la récupération des catégories', error);
        }
      });
    } else {
      this.eventService.getEvents().subscribe({
        next: (data: any) => {
          console.log('Evénements récupérés', data)
          this.events = data;
        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });
    }
  }

  redirectToEventPage(event: Event): void {
    this.router.navigate(['/eventPage'], { queryParams: { eventId: event.id } });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

}
