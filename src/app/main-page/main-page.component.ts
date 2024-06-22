import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  isFilterBoxVisible: boolean = false;
  selectedFilter: string | null = null;

  constructor(private router: Router) { }

  toggleFilterBox() {
    this.isFilterBoxVisible = !this.isFilterBoxVisible;
  }

  onFilterChange(filter: string) {
    if (this.selectedFilter === filter) {
      this.selectedFilter = null;
    } else {
      this.selectedFilter = filter;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;
    const isFilterIconClicked = targetElement.classList.contains('filter-icon');
    const isFilterBoxClicked = targetElement.closest('.filter-box');

    if (!isFilterIconClicked && !isFilterBoxClicked) {
      this.isFilterBoxVisible = false;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}