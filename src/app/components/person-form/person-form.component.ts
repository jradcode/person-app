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
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  isEditMode = false;
  personId: number | null = null;
  isLoading = false;

  // STRICT VALIDATIONS:
  // fullName: No numbers, no symbols, no 'only-spaces', max 50
  // age: Numbers only, min 1, max 135
  personForm = new FormGroup({
    fullName: new FormControl('', { 
      nonNullable: true, 
      validators: [
        Validators.required, 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/) // Must start with a letter, no symbols
      ] 
    }),
    age: new FormControl<number | null>(null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(135)
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
            fullName: data.fullName || data.full_name || '',
            age: data.age !== undefined ? data.age : null
          });
          this.isLoading = false;
        },
        error: () => {
          this.toastService.show('Failed to load person', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  submitForm() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); // Force red errors to show
      return;
    }

    this.isLoading = true;
    const rawValues = this.personForm.getRawValue();
    
    // Clean data: trim the name and ensure age is a number
    const personData = { 
      fullName: rawValues.fullName.trim(), 
      age: Number(rawValues.age) 
    };

    const request$ = (this.isEditMode && this.personId !== null)
      ? this.apiService.editPerson({ ...personData, id: this.personId })
      : this.apiService.addPerson(personData as PersonCreate);

    request$.subscribe({
      next: () => {
        this.toastService.show(this.isEditMode ? 'Updated Successfully!' : 'Added Successfully!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastService.show('Submission failed', 'error');
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}