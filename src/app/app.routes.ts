import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './pages/about/about.component';
import { PersonFormComponent } from './components/person-form/person-form.component';
import { AddPersonFormComponent } from './components/add-person-form/add-person-form.component';
import { PersonCardComponent } from './components/person-card/person-card.component';


export const routes: Routes = [
    {
        path: '',
        component: PersonCardComponent,
        title: 'Home'
    },

    {
        path: 'about', 
        component:  AboutComponent,
        title: 'About'
    },

    {
        path: 'details/:id',
        component:  PersonFormComponent,
        title: 'Edit Tag'
    },
    {
        path: 'add',
        component:  AddPersonFormComponent,
        title: 'Add Tag'
    }

];
