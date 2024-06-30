import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../data/user';

@Injectable()
export class UserService {

  private usersUrl = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user);
  }

  login(pseudo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.usersUrl}/login`, { pseudo, password });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getAllUsersByEvent(id : string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/events/${id}`);
  }
}