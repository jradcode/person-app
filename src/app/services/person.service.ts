import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient); // Modern Angular 19 'inject' pattern
  private apiUrl = 'http://localhost:5000/api/persons';

  getPersons() {
    return this.http.get<any[]>(this.apiUrl);
  }
}