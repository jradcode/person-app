import { Component, inject } from '@angular/core';
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {
  personList: Person[] = [];
  toastMessage: string | null = null;
  //apiService: ApiService = inject(ApiService);
  //person: Person[] = PERSON;

  constructor(private apiService: ApiService = inject(ApiService)) {}
  router = inject(Router);

  ngOnInit(): void {
    this.onGetAllPersons();
  }
  
  onGetAllPersons(): void {
    this.apiService.getAllPersons().subscribe(
      (res) => this.personList = res,
      (error: any) => console.log(error),
      () => console.log("Done getting the persons!"),
    );
  }

  removeTag(personId: number): void {
    this.apiService.deletePerson(personId).subscribe(
      (success) => {
        if (success) {
          this.personList = this.personList.filter(person => person.id !== personId);
          console.log(`Person with Id ${personId} removed successfully.`);
          this.showToast('Nametag Removed!');
          this.router.navigate(['/']);
        }
      },
      (error: any) => console.log("Error removing person: ", error)
    );
  }
  editTag(personId: number): void {
    // 1. Trigger the toast first
    this.showToast('Opening Edit Form...');

    // 2. Delay the navigation slightly so the toast is visible
    setTimeout(() => {
      this.router.navigate(['/details', personId]);
    }, 500);
  }
// Helper method to handle the toast timing
  private showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 2500);
  }
}
