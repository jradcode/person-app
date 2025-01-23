import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
//import { PERSON } from '../../models/person-data';
import { Person } from '../../models/person';
import { ApiService } from '../../services/api.service';
// to pass fullName, age data via prop/service into the form
@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-person-form.component.html',
  styleUrl: './add-person-form.component.css'
})
export class AddPersonFormComponent {
  fb = inject(FormBuilder);
  apiService = inject(ApiService);
  router = inject(Router);
   

  //FormBuilder way - shorter
  personForm = this.fb.group({
    id: ["0"],
    fullName: ["", Validators.required],
    age: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(3)]]
  });
/*
  onAddPerson(): void {
    this.apiService.addPerson(this.person).subscribe(
      (res) => console.log(res),
      (error: any) => console.log(error),
      () => console.log("Done creating user!")
    );
  }
*/
 
  
/*  //normal reactive forms way
  personForm: FormGroup = new FormGroup({
    fullName: new FormControl("", Validators.required),
    age: new FormControl("", Validators.required)
  })
*/

ngOnInit() {
  this.apiService.getAllPersons().subscribe(persons => {
    const latestId: number = persons.reduce((max, person) => parseInt(person.id) > max ? parseInt(person.id) : max, 0);
    this.personForm.patchValue({ id: (latestId + 1).toString() });
  });
}

  
  
  submitForm() {
    if (this.personForm.valid) {
    //need to add a id to be a Person type
      const person: Person = {
        id: String(this.personForm.get('id')?.value),
        fullName: String(this.personForm.get('fullName')?.value),
        age: Number(this.personForm.get('age')?.value)
      };

      this.apiService.addPerson(person).subscribe(
        res => {
          console.log(" Added person Success!", res);
          this.router.navigate(['/']);
        },
        error => console.error("Error! Not added.", error)
      );
    } else {
      console.log("Form is invalid!. Not added.");
    }
  }   
}  
    
    



