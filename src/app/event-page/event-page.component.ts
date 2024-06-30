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

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
  eventid: string = '';
  userid_: any = localStorage.getItem('currentUser');
  user = JSON.parse(this.userid_);
  userid: string = this.user.id;
  event: Event = {} as Event;
  listRegistered: any = [];
  creator: boolean = this.event.createdBy === this.userid;
  registered: boolean = false;
  creatorName: string = '';
  full: boolean = false;
  deleteConfirmation: boolean = false;
  feedbacks: any = [];
  feedbackBool: boolean = false;
  allUsers: any = [];
  allUsersEvent: any = [];
  alreadyFeedback: boolean = false;
  confirmDeleteFeedback: boolean = false;

  formFeedback: FormGroup = this.fb.group({
    comment: ['', Validators.required],
    rate: ['', Validators.required],
    //rate : ['', Validators.compose([Validators.required, Validators.min(1)])],
    eventUserId: [''],
    eventId: [''],
    date: [''],
  });

  constructor(private route: ActivatedRoute, private FeedbackService: FeedbackService, private RegistrationService: RegistrationService, private EventService: EventService, private UserService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.eventid = params['eventId'];
      console.log('Event ID--:', this.eventid);
    });

    this.getEvent();
    if (!this.creator) {
      console.log('Event ID:', this.eventid);
      console.log('User ID:', this.userid);
      console.log('registered:', this.registered);
      this.RegistrationService.getRegistrations(this.eventid).subscribe({
        next: (data: any) => {
          console.log('Evénements récupérés', data)
          this.registered = data.some((registration: any) => registration.eventUserId === this.userid);
          this.listRegistered = data;

        },
        error: (error) => {
          console.error('Erreur dans la récupération des événements', error);
        }
      });

    }
    console.log('this.event.createdBy:', this.event.createdBy);
    console.log('this.userid:', this.userid);
  }

  getEvent() {
    this.EventService.getEventById(this.eventid).subscribe({
      next: (data: any) => {
        console.log('Evénement récupéré', data);
        this.event = data;
        this.getNameCreator();
        this.creator = this.event.createdBy === this.userid;
        console.log('creator:', this.creator);
        console.log('eventDate:', this.event.eventDate);
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
        this.getAllUsers();
        this.getAllUserByEvent();

      },
      error: (error) => {
        console.error('Erreur dans la récupération de l\'événement', error);
      }
    });
  }


  getNameCreator() {
    this.UserService.getUser(this.event.createdBy).subscribe({
      next: (data: any) => {
        console.log('Utilisateur récupéré', data);
        this.creatorName = data.pseudo;
      },
      error: (error) => {
        console.error('Erreur dans la récupération de l\'utilisateur', error);
      }
    });
  }

  formatDate(dateInput: string | number[]): string {
    const dateArray = typeof dateInput === 'string' ? dateInput.split(',').map(Number) : dateInput;
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
    return format(date, "EEEE d MMMM yyyy HH:mm", { locale: fr });
  }

  //fonction s'inscrire
  registration() {
    console.log('Event ID:', this.event.id);
    console.log('User ID:', this.userid);
    const Registration: Registration = {
      id: '',
      eventId: this.event.id,
      userId: this.userid,
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

  //fonction se désinscrire
  unregistration() {
    const registration = this.listRegistered.find((registration: any) => registration.eventUserId === this.userid);
    if (registration) {
      console.log('Registration ID:', registration.id);
      const registrationId = registration.id;
      this.RegistrationService.deleteRegistration(registrationId).subscribe({
        next: (data: any) => {
          console.log('Désinscription réussie', data);
          this.registered = false;
          this.listRegistered = this.listRegistered.filter((registration: any) => registration.eventUserId !== this.userid);
          this.full = this.event.maxCapacity <= this.listRegistered.length;
        },
        error: (error) => {
          console.error('Erreur dans la désinscription', error);
        }
      });
    }
  }

  //fonction supprimer événement
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

  getFeedbacks() {
    this.FeedbackService.getFeedbacks().subscribe({
      next: (data: any) => {
        console.log('Feedbacks récupérés (TOUT)', data);
        this.feedbacks = data;
        this.alreadyFeedback = this.feedbacks.some((feedback: any) => feedback.eventUserId === this.userid && feedback.eventId === this.event.id);
      },
      error: (error) => {
        console.error('Erreur dans la récupération des feedbacks', error);
      }
    });
  }

  getAllUsers() {
    this.UserService.getAllUsers().subscribe({
      next: (data: any) => {
        console.log('Utilisateurs récupérés GETALLUSERS', data);
        this.allUsers = data;
      },
      error: (error) => {
        console.error('Erreur dans la récupération des utilisateurs', error);
      }
    });
  }

  getAllUserByEvent() {
    this.UserService.getAllUsersByEvent(this.eventid).subscribe({
      next: (data: any) => {
        console.log('Utilisateurs récupérés GETALLUSERSBYEVENT', data);
        this.allUsersEvent = data;
      },
      error: (error) => {
        console.error('Erreur dans la récupération des utilisateurs', error);
      }
    });
  }

  isUserInList(userId: string): boolean {
    return this.allUsers.some((user: any) => user.id === userId);
  }

  getFeedbackUser(userId: string): string {
    console.log('idUser:', userId);
    const userPseudo = this.allUsers.find((user: any) => user.id === userId);
    console.log('userPseudo:', userPseudo);
    return userPseudo.pseudo;
  }

  createFeedback() {
    if (this.formFeedback.valid) {
      const formValue = this.formFeedback.value;
      console.log('Formulaire de création de feedback valide', formValue);
      formValue.eventId = this.event.id;
      formValue.eventUserId = this.userid;
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
    }
  }

  canDelete(id: string): boolean {
    return this.userid === id;
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
        console.log('Feedback supprimé', data);
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