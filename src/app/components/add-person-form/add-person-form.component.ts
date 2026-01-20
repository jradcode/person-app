import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService, PersonCreate } from '../../services/api.service';
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
//fix the edit and delete tag toasts
//fix layout to center
@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-person-form.component.html',
  styleUrls: ['./add-person-form.component.css']
})
export class AddPersonFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService); // Inject it

  isEditMode = false;
  personId: number | null = null;
  isLoading = false;
 
  personForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    age: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

 ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');

  if (idParam) {
    const id = Number(idParam);
    this.isEditMode = true;
    this.personId = id;
    this.isLoading = true;

    this.apiService.getPerson(id).subscribe({
      next: (data: any) => {
        console.log("RAW DATA FROM NEON:", data); 

        // This covers all common naming conventions
        this.personForm.patchValue({
          fullName: data.fullName || data.full_name || data.fullname || '',
          age: data.age !== undefined ? data.age : null
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error("API Error:", err);
        this.isLoading = false;
      }
    });
  }
}

 // add-person-form.component.ts
submitForm() {
  if (this.personForm.invalid) return;

  this.isLoading = true;
  const rawValues = this.personForm.getRawValue();
  const personData = { fullName: rawValues.fullName, age: Number(rawValues.age) };

  if (this.isEditMode && this.personId !== null) {
    const personToEdit: Person = { ...personData, id: this.personId };
    
    this.apiService.editPerson(personToEdit).subscribe({
      next: () => {
        this.toastService.show('Successfully Updated!'); // Use service
        this.router.navigate(['/']); // Redirect immediately
      },
      error: (err) => {
        this.toastService.show('Update failed', 'error');
        this.isLoading = false;
      }
    });
  } else {
    // ADD MODE logic...
    this.apiService.addPerson(personData as PersonCreate).subscribe({
      next: () => {
        this.toastService.show('Successfully Added!');
        this.router.navigate(['/']);
      }
    });
  }
}
  
  cancel() {
    this.router.navigate(['/']);
  }
}