import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Feedback } from '../data/feedback';

@Injectable()
export class FeedbackService {

    private feedbackUrl = `${environment.apiUrl}feedbacks`;

    constructor(private http: HttpClient) { }

    getFeedbacks(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(`${this.feedbackUrl}`);
    }

    createFeedback(feedback :Feedback): Observable<any> {
        console.log('Feedback:', feedback);
        return this.http.post(`${this.feedbackUrl}`, feedback);
    }

    deleteFeedback(id: string): Observable<any> {
        return this.http.delete(`${this.feedbackUrl}/${id}`);
    }

}