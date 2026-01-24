import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { lastValueFrom } from 'rxjs'; // Modern replacement for .toPromise()
import { Observable } from 'rxjs';
import { Person } from '../models/person';
import { environment } from '../../environments/environment';

export type PersonCreate = Omit<Person, 'id'>;


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private personUrl = environment.personUrl;
  private http = inject(HttpClient);

  //turn these calls into a Promise
  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.personUrl}/persons`);
  }

  getPerson(id: number): Observable<Person> { 
    return this.http.get<Person>(`${this.personUrl}/persons/${id}`);
  }

  //from Person type to any
  addPerson(person: PersonCreate): Observable<Person> { 
    return this.http.post<Person>(`${this.personUrl}/persons`, person);
  }

  editPerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.personUrl}/persons/${person.id}`, person);
  }

  deletePerson(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.personUrl}/persons/${id}`);
  }
}
 

