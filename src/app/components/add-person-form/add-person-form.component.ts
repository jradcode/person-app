import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService, PersonCreate } from '../../services/api.service';
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common';
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

  isEditMode = false;
  personId: number | null = null;
  isLoading = false;
  toastMessage: string | null = null; // For the toast

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

  submitForm() {
    if (this.personForm.invalid) return;

    this.isLoading = true;
    const rawValues = this.personForm.getRawValue();
    const personData = {
      fullName: rawValues.fullName,
      age: Number(rawValues.age)
    };

    if (this.isEditMode && this.personId !== null) {
      // EDIT MODE
      const personToEdit: Person = { ...personData, id: this.personId };
      console.log('Submitting Update:', personToEdit);
      
      this.apiService.editPerson(personToEdit).subscribe({
        next: () => this.handleSuccess('Successfully Updated!'),
        error: (err) => this.handleError(err)
      });
    } else {
      // ADD MODE
      this.apiService.addPerson(personData as PersonCreate).subscribe({
        next: () => this.handleSuccess('Successfully Added!'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(message: string) {
    this.isLoading = false;
    this.toastMessage = message;
    console.log('Success Toast Triggered:', message);
    
    setTimeout(() => {
      this.toastMessage = null;
      this.router.navigate(['/']);
    }, 2000);
  }

  private handleError(err: any) {
    this.isLoading = false;
    console.error('API Error:', err);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}