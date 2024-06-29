import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsUrl = `${environment.apiUrl}events`;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl);
  }

  createEvent(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.eventsUrl, formData, { headers });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.eventsUrl}/${id}`);
  }

  updateEvent(id: string, event: Event): Observable<any> {
    return this.http.put(`${this.eventsUrl}/${id}`, event);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.eventsUrl}/${id}`);
  }

  searchEvents(search: string, filter: string): Observable<Event[]> {
    const url = `${this.eventsUrl}/filter/${search}/${filter}`;
    return this.http.get<Event[]>(url);
  }

  getEventsByRegistration(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.eventsUrl}/user/${userId}`);
  }
}