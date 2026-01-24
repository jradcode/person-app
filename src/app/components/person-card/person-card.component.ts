import { Component, OnInit, inject, signal } from '@angular/core'; // Added OnInit
import { Person } from '../../models/person'; 
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service'; // 1. Import the Service

@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent implements OnInit {
  private apiService = inject(ApiService);
  private toast = inject(ToastService); //Inject the Global Toast Service
  private router = inject(Router);

  //using signals for list
  personList = signal<Person[]>([]);

  ngOnInit(): void {
    this.onGetAllPersons();
  }
  
  onGetAllPersons(): void {
    this.apiService.getAllPersons().subscribe({
      next: (res) => this.personList.set(res), // set signal
      error: (err) => {
        console.error(err);
        this.toast.show('Failed to load persons', 'error');
      }
    });
  }

 removeTag(personId: number): void {
    // delete confirmation
    if (!confirm('You want to delete?')) return;

    this.apiService.deletePerson(personId).subscribe({
      next: () => {
        // signal Update
        this.personList.update(list => list.filter(p => p.id !== personId));
        
        this.toast.show('Nametag Removed!', 'error'); 
        
        if (this.router.url.includes('details')) {
          this.router.navigate(['/']);
        }
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