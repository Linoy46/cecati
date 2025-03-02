import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true, // Asegúrate de que es standalone
  imports: [RouterModule], // Agrega RouterModule a la lista de imports
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.css']
})
export class AuthenticatedLayoutComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}