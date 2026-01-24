import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core'; // Added signal
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService, PersonCreate } from '../../services/api.service';
import { Person } from '../../models/person';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './add-person-form.component.html',
  styleUrls: ['./add-person-form.component.css']
})
export class AddPersonFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);

  // Using Signals for UI State
  isEditMode = signal(false); 
  personId = signal<number | null>(null);
  isLoading = signal(false);

  // Validation Rules: No numbers/special chars, max 50 chars, age max 3 digits
  personForm = this.fb.group({
    fullName: ['', { 
      validators: [
        Validators.required, 
        Validators.maxLength(50),
        // Must start with a letter and contain only letters/spaces
        // This prevents a string of only spaces from passing
        Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*$/)
      ] 
    }],
    age: [null as number | null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(135) // Limits to 3 digits
    ]]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      
      //Signal set
      const id = Number(idParam);
      this.isEditMode.set(true); 
      this.personId.set(id);     
      this.isLoading.set(true);

      this.apiService.getPerson(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: any) => {
            this.personForm.patchValue({
              fullName: data.fullName || data.full_name || data.fullname || '',
              age: data.age !== undefined ? data.age : null
            });
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error("API Error:", err);
            this.toastService.show('Failed to load person data', 'error');
            this.isLoading.set(false);
          }
        });
    }
  }

  // This submits form
  submitForm() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched(); // Triggers red borders/messages
      return;
    }

    this.isLoading.set(true);
    const rawValues = this.personForm.getRawValue();
    const personData = { 
      fullName: rawValues.fullName.trim(), 
      age: Number(rawValues.age) 
    };

    const id = this.personId(); // Accessing Signal value

    if (this.isEditMode() && id !== null) {
      const personToEdit: Person = { ...personData, id: id };
      this.apiService.editPerson(personToEdit)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.show('Successfully Updated!');
            this.router.navigate(['/']);
          },
          error: () => {
            this.toastService.show('Update failed', 'error');
            this.isLoading.set(false);
          }
        });
    } else {
      this.apiService.addPerson(personData as PersonCreate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastService.show('Successfully Added!');
            this.router.navigate(['/']);
          },
          error: () => {
            this.toastService.show('Failed to add person', 'error');
            this.isLoading.set(false);
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}