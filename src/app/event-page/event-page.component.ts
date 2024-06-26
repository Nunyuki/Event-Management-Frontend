import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Event } from "../data/event";
import { EventService } from '../services/event.service';
import { RegistrationService } from '../services/registration.service';
import { format } from 'date-fns';
import { Registration } from '../data/registration';
import { UserService } from '../services/user.service';
import { fr } from 'date-fns/locale';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent {
    eventid : string = '';
    userid_ : any = localStorage.getItem('currentUser');
    user = JSON.parse(this.userid_);
    userid : string = this.user.id;
    event : Event = {} as Event;
    listRegistered : any = [];
    creator : boolean = this.event.createdBy === this.userid;
    registered : boolean = false;
    creatorName : string ='';

    constructor(private route: ActivatedRoute, private RegistrationService : RegistrationService, private EventService : EventService, private UserService : UserService, private router: Router) {}

    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            this.eventid = params['eventId'];
            console.log('Event ID--:', this.eventid);
        });

        this.getEvent();
        if (!this.creator){
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
    }

    getEvent() {
        this.EventService.getEventById(this.eventid).subscribe({
            next: (data: any) => {
                console.log('Evénement récupéré', data);
                this.event = data;
                this.getNameCreator();
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
        const Registration : Registration = {
            id: '',
            eventId: this.event.id,
            userId: this.userid,
        } as Registration;
        this.RegistrationService.register(Registration).subscribe({
            next: (data: any) => {
                console.log('Inscription réussie', data);
                this.registered = true;
                this.listRegistered.push(data);
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

    //fonction modifier événement
    // updateEvent() {
    //     this.EventService.updateEvent(this.event.id, this.event).subscribe({
    //         next: (data: any) => {
    //             console.log('Evénement modifié', data);
    //         },
    //         error: (error) => {
    //             console.error('Erreur dans la modification de l\'événement', error);
    //         }
    //     });
    // }

}
