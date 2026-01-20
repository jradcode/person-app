import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
//import { PersonCardComponent } from "./components/person-card/person-card.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';
//import { AboutComponent } from "./pages/about/about.component";





@Component({
  selector: 'app-root',
  standalone: true, // Angular 19 components are standalone by default, but it's good practice to be explicit
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    NavbarComponent, 
    CommonModule // <--- Add this for directive support
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'person-app';
  public toast = inject(ToastService);
}