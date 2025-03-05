import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout().subscribe(() => {
      // Redirigir al login u otra página después de cerrar sesión
      this.router.navigate(['/login']);
    });
  }
}