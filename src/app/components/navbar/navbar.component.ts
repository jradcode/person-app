import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
//import { AboutComponent } from "../../pages/about/about.component";


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
