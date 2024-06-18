import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../data/user';

@Injectable()
export class UserService {

    private usersUrl = `${environment.apiUrl}users`;

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.usersUrl);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.usersUrl, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.usersUrl}/${user.id}`, user);
    }

    deleteUser(user: User): Observable<User> {
        return this.http.delete<User>(`${this.usersUrl}/${user.id}`);
    }

    login(pseudo: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.usersUrl}/login`, { pseudo, password });
    }

    checkPseudo(pseudo: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.usersUrl}/users/check-pseudo/${pseudo}`);
    }
}