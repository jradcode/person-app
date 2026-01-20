import { Component, OnInit, inject } from '@angular/core'; // Added OnInit
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service'; // 1. Import the Service

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent implements OnInit {
  private apiService = inject(ApiService);
  private toast = inject(ToastService); //Inject the Global Toast Service
  private router = inject(Router);

  personList: Person[] = [];

  ngOnInit(): void {
    this.onGetAllPersons();
  }
  
  onGetAllPersons(): void {
    this.apiService.getAllPersons().subscribe({
      next: (res) => this.personList = res,
      error: (err) => console.error(err)
    });
  }

  removeTag(personId: number): void {
    this.apiService.deletePerson(personId).subscribe({
      next: () => {
        this.personList = this.personList.filter(person => person.id !== personId);
        
        this.toast.show('Nametag Removed!', 'error'); 
        console.log(`Person with Id ${personId} removed.`);
      },
      error: (err) => {
        console.error("Error removing person: ", err);
        this.toast.show('Delete failed', 'error');
      }
    });
  }

  editTag(personId: number): void {
    // The Global Toast stays visible even after the page changes.
    this.toast.show('Opening Edit Form...', 'success');
    this.router.navigate(['/details', personId]);
  }
}