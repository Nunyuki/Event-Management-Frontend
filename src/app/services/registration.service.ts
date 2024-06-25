import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Registration } from '../data/registration';

@Injectable()
export class RegistrationService {

    private registrationsUrl = `${environment.apiUrl}registrations`;

    constructor(private http: HttpClient) { }

    getRegistrations(eventid: string): Observable<Registration[]> {
        return this.http.get<Registration[]>(`${this.registrationsUrl}/events/${eventid}`);
    }

    register(registration :Registration): Observable<any> {
        console.log('Registration:', registration);
        return this.http.post(`${this.registrationsUrl}`, registration);
    }

    deleteRegistration(id: string): Observable<any> {
        return this.http.delete(`${this.registrationsUrl}/${id}`);
    }

}