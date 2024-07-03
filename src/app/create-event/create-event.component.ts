import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EventService } from '../services/event.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../data/category';
import { environment } from '../environments/environment';
import { th } from 'date-fns/locale';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {

  minDate = new Date();
  startDate: Date | null = null;

  selectedImage: File | null = null;
  selectedImageBytes: Uint8Array | null = null;
  selectedImageBase64: string | null = null;

  showCreateCategoryForm: boolean = false;
  showCategoryMenu: boolean = false;
  showCategoryImageSelector: boolean = false;

  categories: Category[] = [];
  selectedCategory: string | null = null;
  categoryImages: string[] = [];
  selectedCategoryImage: string | null = null;

  errorMessage: string | null = null;
  categoryErrorMessage: string | null = null;

  form: FormGroup = this.fb.group({
    eventName: ['', Validators.required],
    eventDescription: ['', Validators.required],
    eventLocation: ['', Validators.required],
    maxCapacity: ['', Validators.required],
    categoryName: ['', Validators.required],
    eventDate: ['',],
    createdBy: [''],
    image: [''],

    date: ['', Validators.required],
    heure: ['', Validators.required],
  });

  formCategory: FormGroup = this.fb.group({
    categoryName: ['', Validators.required],
    imagePath: ['', Validators.required],
  });

  eventId: string = '';
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private http: HttpClient, private eventService: EventService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      if (this.eventId) {
        this.getEvent();
      }
    });
    
    const nbCategoryImages = environment.nbCategoryImages;
    for (let i = 1; i <= nbCategoryImages; i++) {
      this.categoryImages.push(`../../assets/categories/template${i}.png`);
    }

    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        console.log('Catégories récupérées', data)
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur dans la récupération des catégories', error);
      }
    });
    console.log('eventId', this.eventId);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageBase64 = e.target.result as string;
      };
      reader.readAsDataURL(file);

      const byteReader = new FileReader();
      byteReader.onload = (e: any) => {
        const bytesArray = new Uint8Array(e.target.result);
        this.selectedImageBytes = bytesArray;
      };
      byteReader.readAsArrayBuffer(file);
    }
  }

  getImageSrc(): string {
    if (this.selectedImageBytes) {
      return `data:image/png;base64,${btoa(String.fromCharCode(...this.selectedImageBytes))}`;
    }
    return '';
  }

  toggleCategoryMenu() {
    if (this.showCreateCategoryForm) {
      this.toggleCreateCategoryForm();
    }
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  toggleCreateCategoryForm() {
    if (this.showCategoryMenu) {
      this.toggleCategoryMenu();
    }
    this.showCreateCategoryForm = !this.showCreateCategoryForm;
  }

  toggleCategoryImageSelector() {
    this.showCategoryImageSelector = !this.showCategoryImageSelector;
  }

  selectCategoryImage(image: string): void {
    this.toggleCategoryImageSelector();
    this.selectedCategoryImage = image;
    this.formCategory.controls['imagePath'].setValue(image.split('/')[4].split('.')[0]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  createEvent() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const eventDate = `${this.formatDate(formValue.date)}T${formValue.heure}`;
      this.form.controls['eventDate'].setValue(eventDate);

      const created_by = JSON.parse(localStorage.getItem('currentUser') as string).id;
      this.form.controls['createdBy'].setValue(created_by);

      if (this.selectedImage && this.selectedImageBytes) {
        this.form.controls['image'].setValue(Array.from(this.selectedImageBytes));
      }

      const updatedFormValue = this.form.value;
      console.log('Formulaire valide', updatedFormValue);

      this.eventService.createEvent(updatedFormValue).subscribe({
        next: (response) => {
          console.log('Evènement créé avec succès', response);
          this.router.navigate(['/allCategoryEvent'], { queryParams: { displayMode: 'events' } });
        },
        error: (error) => {
          console.log('Erreur lors de la création de l\'évènement', error);
          this.errorMessage = 'Erreur lors de la création de l\'évènement';
        }
      });
    } else {
      console.log('Formulaire invalide', this.form.value);
      this.errorMessage = 'Veuillez remplir tous les champs';
    }
  }

  createCategory() {
    if (this.formCategory.valid) {
      const formValue = this.formCategory.value;
      console.log('Formulaire de création de catégorie valide', formValue);

      this.categoryService.createCategory(formValue).subscribe({
        next: (response) => {
          console.log('Catégorie créée avec succès', response);
          this.categoryService.getCategories().subscribe({
            next: (data: Category[]) => {
              console.log('Catégories misent à jour', data)
              this.categories = data;
            },
            error: (error) => {
              console.error('Erreur dans la récupération des catégories', error);
            }
          });
          this.formCategory.reset();
          this.selectedCategoryImage = null;
          this.toggleCreateCategoryForm();
          this.toggleCategoryMenu();
          this.selectedCategory = formValue.categoryName;
          this.form.controls['categoryName'].setValue(formValue.categoryName);
        },
        error: (error) => {
          this.categoryErrorMessage = 'La catégorie existe déjà';
        }
      });
    } else {
      console.log('Formulaire de création de catégorie invalide', this.formCategory.value);
      this.categoryErrorMessage = 'Veuillez remplir tous les champs';
    }
  }

  getEvent() {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data: any) => {
        console.log('Evénement récupéré', data);
        this.form.controls['eventName'].setValue(data.eventName);
        this.form.controls['eventDescription'].setValue(data.eventDescription);
        this.form.controls['eventLocation'].setValue(data.eventLocation);
        this.form.controls['maxCapacity'].setValue(data.maxCapacity);
        this.form.controls['categoryName'].setValue(data.categoryName);

        const year = data.eventDate[0];
        const month = data.eventDate[1] - 1;
        const day = data.eventDate[2];
        const hours = data.eventDate[3];
        const minutes = data.eventDate[4];
        this.startDate = new Date(year, month, day, hours, minutes);
        this.form.controls['date'].setValue(this.startDate);

        const heure : string = data.eventDate[3]+":"+data.eventDate[4];
        this.form.controls['heure'].setValue(heure);
        this.form.controls['createdBy'].setValue(data.createdBy);
        this.selectedImageBase64 = data.image ? `data:image/png;base64,${data.image}` : null;
        this.form.controls['image'].setValue(data.image);
      },
      error: (error) => {
        console.error('Erreur dans la récupération de l\'événement', error);
      }
    });
  }

  buttonUpdateEvent() {
    if(this.form.valid){
      const formValue = this.form.value;
      const eventDate = `${this.formatDate(formValue.date)}T${formValue.heure}`;
      this.form.controls['eventDate'].setValue(eventDate);

      const created_by = JSON.parse(localStorage.getItem('currentUser') as string).id;
      this.form.controls['createdBy'].setValue(created_by);

      if (this.selectedImage && this.selectedImageBytes) {
        this.form.controls['image'].setValue(Array.from(this.selectedImageBytes));
      }
      const updatedFormValue = this.form.value;
      console.log('Formulaire valide', updatedFormValue);

      this.eventService.updateEvent(this.eventId, updatedFormValue).subscribe({
        next: (response) => {
          console.log('Evènement modifié avec succès', response);
          this.router.navigate(['/eventPage'], { queryParams: { eventId: this.eventId } });
        },
        error: (error) => {
          console.log('Erreur lors de la modification de l\'évènement', error);
          this.errorMessage = 'Erreur lors de la modification de l\'évènement';
        }
      });
    } else {
      console.log('Formulaire invalide', this.form.value);
      console.log('Formulaire controle',this.form.controls);
      this.errorMessage = 'Veuillez remplir tous les champs';
    }
  }
}