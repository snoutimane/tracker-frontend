import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8089'; // Replace with your backend API base URL

  constructor(private http: HttpClient) {}

  // Define a function to make a POST request to authenticate
  authenticate(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // You can add other headers as needed
    });

    const body = { username, password };

    // Make the POST request with the headers
    return this.http.post(`${this.baseUrl}/admin/authenticate`, body, { headers });
  }

  
  // Define other API functions as needed
}
