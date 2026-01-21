import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
//import { PERSON } from '../../models/person-data';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Person } from '../../models/person';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent {
  //ActivatedRoute saves route and parameters for the data (param strings)
  route: ActivatedRoute = inject(ActivatedRoute);
  //apiService = inject(ApiService);
  person: Person | undefined;
  personForm: FormGroup;
  router = inject(Router);
  toast = inject(ToastService);

  constructor(private apiService: ApiService = inject(ApiService)) {
    this.personForm = this.fb.group({
      fullName: ["", Validators.required],
      age: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(3)]]
    });
  }

  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.onGetPerson();
  }

  onGetPerson(): void {
    const personId = Number(this.route.snapshot.params["id"]);
    this.apiService.getPerson(personId).subscribe(
      (res) => { 
        this.person = res;
        //use setValue on personForm to set the values displayed on the card
        if (this.person) {
          this.personForm.setValue({
            fullName: this.person.fullName,
            age: this.person.age
          });
        }
      },
      (error: any) => console.log(error),
      () => console.log("Done getting that 1 person!"),
    );   
  }
       
    //set data from home page into form
  

  submitForm() {
    if (this.personForm.valid && this.person) {
      const person: Person = {
        id: this.person.id,
        fullName: String(this.personForm.get("fullName")?.value),
        age: Number(this.personForm.get("age")?.value)
      };
      this.apiService.editPerson(person).subscribe(
        res => {
          console.log('Update Success!', res);
          this.toast.show('Nametag Updated!', 'success');
          this.router.navigate(['/']);
        },
        error => console.error("Error!", error)
      );
    } else {
      console.log("Form update failed!");
      this.toast.show("Update Failed!', 'error");
    }
  }
}
