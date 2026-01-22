import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService, PersonCreate } from '../../services/api.service';
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

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
  private toastService = inject(ToastService);

  isEditMode = false;
  personId: number | null = null;
  isLoading = false;

  // Validation Rules: No numbers/special chars, max 50 chars, age max 3 digits
  personForm = new FormGroup({
    fullName: new FormControl('', { 
      nonNullable: true, 
      validators: [
        Validators.required, 
        Validators.maxLength(50),
        // Must start with a letter and contain only letters/spaces
        // This prevents a string of only spaces from passing
        Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)
      ] 
    }),
    age: new FormControl<number | null>(null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(135) // Limits to 3 digits
    ])
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
          this.personForm.patchValue({
            fullName: data.fullName || data.full_name || data.fullname || '',
            age: data.age !== undefined ? data.age : null
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.toastService.show('Failed to load person data', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  submitForm() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); // Triggers red borders/messages
      return;
    }

    this.isLoading = true;
    const rawValues = this.personForm.getRawValue();
    const personData = { 
      fullName: rawValues.fullName.trim(), 
      age: Number(rawValues.age) 
    };

    if (this.isEditMode && this.personId !== null) {
      const personToEdit: Person = { ...personData, id: this.personId };
      this.apiService.editPerson(personToEdit).subscribe({
        next: () => {
          this.toastService.show('Successfully Updated!');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastService.show('Update failed', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.apiService.addPerson(personData as PersonCreate).subscribe({
        next: () => {
          this.toastService.show('Successfully Added!');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastService.show('Failed to add person', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}