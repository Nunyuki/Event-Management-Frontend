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
  showFilterBox: boolean = false;

  categories: Category[] = [];
  categoryRows: any[][] = [];

  events: any[] = [];

  query: string | null = null;
  filter: string | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private categoryService: CategoryService, private eventService: EventService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['displayMode']) {
        this.displayMode = params['displayMode'];
      }
      if (params['query']) {
        this.query = params['query'];
      }
      if (params['filter']) {
        this.filter = params['filter'];
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

      const query = this.query ?? '';
      const filter = this.filter ?? 'default';

      if (query) {
        this.eventService.searchEvents(query, filter).subscribe({
          next: (data: any) => {
            console.log('Evénements récupérés', data);
            this.events = data.reverse();
          },
          error: (error) => {
            console.error('Erreur dans la récupération des événements', error);
          }
        });
      } else {
        this.eventService.getEvents().subscribe({
          next: (data: any) => {
            console.log('Evénements récupérés', data);
            this.events = data.reverse();
          },
          error: (error) => {
            console.error('Erreur dans la récupération des événements', error);
          }
        });
      }
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
          this.events = data.reverse();
        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });
    }
  }

  toggleFilterBox(): void {
    this.showFilterBox = !this.showFilterBox;
  }

  sortEvents(criteria: string): void {
    if (this.displayMode === 'categories') {
      this.eventService.getEvents().subscribe({
        next: (data: any) => {
          console.log('Evénements récupérés', data)
          this.events = data;
          this.displayMode = 'events';
          this.sortEvents(criteria);
        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });
    } else {
      switch (criteria) {
        case 'name-asc':
          this.events.sort((a, b) => a.eventName.localeCompare(b.eventName));
          break;
        case 'name-desc':
          this.events.sort((a, b) => b.eventName.localeCompare(a.eventName));
          break;
        case 'date-asc':
          this.events.sort((a, b) => this.arrayToDate(a.eventDate).getTime() - this.arrayToDate(b.eventDate).getTime());
          break;
        case 'date-desc':
          this.events.sort((a, b) => this.arrayToDate(b.eventDate).getTime() - this.arrayToDate(a.eventDate).getTime());
          break;
      }
      this.showFilterBox = false;
    }
  }

  arrayToDate(dateArray: number[]): Date {
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
  }

  redirectToEventPage(event: Event): void {
    this.router.navigate(['/eventPage'], { queryParams: { eventId: event.id } });
  }

  searchByCategory(category: string): void {
    this.eventService.searchEvents(category ?? '', 'category').subscribe({
      next: (data: any) => {
        console.log('Evénements récupérés', data);
        this.events = data;
        this.displayMode = 'events'
      },
      error: (error) => {
        console.error('Erreur dans la récupération des événements', error);
      }
    });
  }
}