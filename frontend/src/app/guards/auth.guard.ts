import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, AuthResponse } from '../services/auth.service'; // Importar AuthResponse aquí
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.verificarSesion().pipe(
      map((response: AuthResponse) => {
        console.log('Verificación de sesión:', response); //  Verificar qué responde el backend

        if (response && response.sesion_activa) {
          return true;
        } else {
          console.warn('Sesión inactiva, redirigiendo a login...');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
