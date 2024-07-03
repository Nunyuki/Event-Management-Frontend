import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Event } from "../data/event";
import { EventService } from '../services/event.service';
import { FeedbackService } from '../services/feedback.service';
import { RegistrationService } from '../services/registration.service';
import { format } from 'date-fns';
import { Registration } from '../data/registration';
import { UserService } from '../services/user.service';
import { fr } from 'date-fns/locale';
import { Feedback } from '../data/feedback';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../data/user';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
  user: User = {} as User;

  eventid: string = '';
  event: Event = {} as Event;
  creator: boolean = false;
  creatorName: string = '';
  full: boolean = false;
  registered: boolean = false;
  listRegistered: any = [];

  feedbacks: any = [];
  feedbackBool: boolean = false;
  alreadyFeedback: boolean = false;
  confirmDeleteFeedback: boolean = false;
  deleteConfirmation: boolean = false;

  errorMessage: string | null = null;

  formFeedback: FormGroup = this.fb.group({
    comment: ['', Validators.required],
    rate: ['', Validators.required],
    eventUserId: [''],
    eventId: [''],
    date: [''],
  });

  constructor(private route: ActivatedRoute, private FeedbackService: FeedbackService, private RegistrationService: RegistrationService, private EventService: EventService, private UserService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventid = params['eventId'];
    });

    this.user = JSON.parse(localStorage.getItem('currentUser') as string) as User;

    this.getEvent();
    if (!this.creator) {
      this.RegistrationService.getRegistrations(this.eventid).subscribe({
        next: (data: any) => {
          console.log('Registrations récupérés', data)
          this.registered = data.some((registration: any) => registration.eventUserId === this.user.id);
          this.listRegistered = data;
        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });
    }

  }

  getEvent() {
    this.EventService.getEventById(this.eventid).subscribe({
      next: (data: any) => {
        console.log('Evénement récupéré', data);
        this.event = data;
        this.UserService.getUser(this.event.createdBy).subscribe({
          next: (data: any) => {
            console.log('Créateur récupéré', data.pseudo);
            this.creatorName = data.pseudo;
          },
          error: (error) => {
            console.error('Erreur lors de la récupération du créateur', error);
          }
        });
        this.creator = this.event.createdBy === this.user.id;
        this.full = this.event.maxCapacity <= this.listRegistered.length;

        const year = data.eventDate[0];
        const month = data.eventDate[1] - 1;
        const day = data.eventDate[2];
        const hours = data.eventDate[3];
        const minutes = data.eventDate[4];
        const dateTMP = new Date(year, month, day, hours, minutes);
        this.feedbackBool = dateTMP < new Date();
        console.log('FeedbackBool:', this.feedbackBool);

        if (this.feedbackBool) {
          this.getFeedbacks();
        }
      },
      error: (error) => {
        console.error('Erreur dans la récupération de l\'événement', error);
      }
    });
  }

  formatDate(dateInput: string | number[]): string {
    if (!dateInput) {
      return '';
    }
    const dateArray = typeof dateInput === 'string' ? dateInput.split(',').map(Number) : dateInput;
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return format(date, "EEEE d MMMM yyyy HH:mm", { locale: fr });
  }

  registration() {
    console.log('Event ID:', this.event.id);
    console.log('User ID:', this.user.id);

    const Registration: Registration = {
      id: '',
      eventId: this.event.id,
      userId: this.user.id,
    } as Registration;

    this.RegistrationService.register(Registration).subscribe({
      next: (data: any) => {
        console.log('Inscription réussie', data);
        this.registered = true;
        this.listRegistered.push(data);
        this.full = this.event.maxCapacity <= this.listRegistered.length;
      },
      error: (error) => {
        console.error('Erreur dans l\'inscription', error);
      }
    });
  }

  unregistration() {
    const registration = this.listRegistered.find((registration: any) => registration.eventUserId === this.user.id);

    if (registration) {
      console.log('Registration ID:', registration.id);
      const registrationId = registration.id;

      this.RegistrationService.deleteRegistration(registrationId).subscribe({
        next: (data: any) => {
          console.log('Désinscription réussie');
          this.registered = false;
          this.listRegistered = this.listRegistered.filter((registration: any) => registration.eventUserId !== this.user.id);
          this.full = this.event.maxCapacity <= this.listRegistered.length;
        },
        error: (error) => {
          console.error('Erreur dans la désinscription', error);
        }
      });
    }
  }


  deleteEvent() {
    this.EventService.deleteEvent(this.event.id).subscribe({
      next: (data: any) => {
        console.log('Evénement supprimé', data);
        this.router.navigate(['/allCategoryEvent']);
      },
      error: (error) => {
        console.error('Erreur dans la suppression de l\'événement', error);
      }
    });
  }

  confirmDelete() {
    this.deleteConfirmation = true;
  }

  cancelDelete() {
    this.deleteConfirmation = false;
  }

  redirectToCreatePage(): void {
    this.router.navigate(['/createEvent'], { queryParams: { eventId: this.event.id } });
  }

  isUserInList(): boolean {
    return this.feedbacks.some((feedback: any) => feedback.eventUserId === this.user.id);
  }

  getFeedbacks() {
    this.FeedbackService.getFeedbacks(this.eventid).subscribe({
      next: (data: any) => {
        console.log('Feedbacks récupérés (TOUT)', data);
        this.feedbacks = data.reverse();
        this.alreadyFeedback = this.isUserInList();
        for (let i = 0; i < this.feedbacks.length; i++) {
          this.getPseudo(this.feedbacks[i]);
        }
      },
      error: (error) => {
        console.error('Erreur dans la récupération des feedbacks', error);
      }
    });
  }

  getPseudo(feedback: any) {
    this.UserService.getUser(feedback.eventUserId).subscribe({
      next: (data: any) => {
        feedback.userPseudo = data.pseudo;
      },
      error: (error) => {
        console.error('Erreur du pseudo l\'utilisateur', error);
      }
    });
  }

  createFeedback() {
    this.errorMessage = null;

    if (this.formFeedback.valid) {
      
      const formValue = this.formFeedback.value;
      console.log('Formulaire de création de feedback valide', formValue);
      formValue.eventId = this.event.id;
      formValue.eventUserId = this.user.id;
      formValue.date = new Date().toISOString();

      this.FeedbackService.createFeedback(formValue).subscribe({
        next: (response) => {
          console.log('Feedback créé avec succès', response);
          this.getFeedbacks();
          this.formFeedback.reset();
        },
        error: (error) => {
          console.log('Erreur lors de la création du feedback', error);
        }
      });
    } else {
      console.log('Formulaire de création de feedback invalide', this.formFeedback.value);
      this.errorMessage = 'Veuillez remplir tous les champs';
    }
  }

  canDelete(id: string): boolean {
    return this.user.id === id;
  }

  confirmDeleteFeedbackFunc() {
    this.confirmDeleteFeedback = true;
  }

  cancelDeleteFeedback() {
    this.confirmDeleteFeedback = false;
  }

  deleteFeedback(id: string) {
    this.FeedbackService.deleteFeedback(id).subscribe({
      next: (data: any) => {
        console.log('Feedback supprimé');
        this.getFeedbacks();
      },
      error: (error) => {
        console.error('Erreur dans la suppression du feedback', error);
      }
    });
  }

  getStarClass(rate: number, starNumber: number): string {
    if (rate >= starNumber) {
      return 'checked';
    } else {
      return '';
    }
  }
}