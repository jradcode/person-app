import { Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private personUrl = environment.personUrl;

  constructor(private http: HttpClient) { }
 
  //turn these calls into a Promise
  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.personUrl}/persons`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.personUrl}/persons/${id}`);
  }

  //from Person type to any
  addPerson(person: Person): Observable<Person> { 
    return this.http.post<Person>(`${this.personUrl}/persons`, person);
  }

  editPerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.personUrl}/persons/${person.id}`, person);
  }

  deletePerson(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.personUrl}/persons/${id}`);
  }
   
  submitForm(fullName: string, age: number) {
    console.log(fullName, age);
  }
}
