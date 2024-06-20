import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EventService } from '../services/event.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../data/category';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent {
  selectedImage: File | null = null;
  selectedImageBytes: Uint8Array | null = null;
  selectedImageBase64: string | null = null;

  categories: Category[] = [];
  showCategoryMenu: boolean = false;
  selectedCategory: string | null = null;

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

  constructor(private fb: FormBuilder, private http: HttpClient, private eventService: EventService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        console.log('Catégories récupérées', data)
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur dans la récupération des catégories', error);
      }
    });
  }

  get eventName() {
    return this.form.controls['eventName'];
  }

  get description() {
    return this.form.controls['description'];
  }

  get date() {
    return this.form.controls['date'];
  }

  get heure() {
    return this.form.controls['heure'];
  }

  get placeDisponible() {
    return this.form.controls['placeDisponible'];
  }

  get category() {
    return this.form.controls['category'];
  }

  get eventLocation() {
    return this.form.controls['eventLocation'];
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
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  createEvent() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const eventDate = `${formValue.date}T${formValue.heure}`;
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
        },
        error: (error) => {
          console.log('Erreur lors de la création de l\'évènement', error);
        }
      });
    } else {
      console.log('Formulaire invalide');
      if (this.selectedImage) {
        this.form.controls['image'].setValue(this.selectedImage.name);
      }
      console.log('Formulaire ', this.form.value);
    }
  }
}
