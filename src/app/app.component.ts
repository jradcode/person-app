import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
//import { PersonCardComponent } from "./components/person-card/person-card.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
//import { AboutComponent } from "./pages/about/about.component";





@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'person-app';
}
