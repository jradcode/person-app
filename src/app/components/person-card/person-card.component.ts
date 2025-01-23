import { Component, inject } from '@angular/core';
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-person-card',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {
  personList: Person[] = [];
  //apiService: ApiService = inject(ApiService);
  //person: Person[] = PERSON;

  constructor(private apiService: ApiService = inject(ApiService)) {}

  ngOnInit(): void {
    this.onGetAllPersons();
  }
  router = inject(Router);

  onGetAllPersons(): void {
    this.apiService.getAllPersons().subscribe(
      (res) => this.personList = res,
      (error: any) => console.log(error),
      () => console.log("Done getting the persons!"),
    );
  }

  removeTag(personId: string): void {
    this.apiService.deletePerson(personId).subscribe(
      (success) => {
        if (success) {
          this.personList = this.personList.filter(person => person.id !== personId);
          console.log(`Person with Id ${personId} removed successfully.`);
          this.router.navigate(['/']);
        }
      },
      (error: any) => console.log("Error removing person: ", error)
    );
    //this.apiService.deletePerson(id)
  }
}
