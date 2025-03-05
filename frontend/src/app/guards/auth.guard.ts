import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService, AuthResponse } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.verificarSesion().pipe(
      map((response: AuthResponse) => {
        console.log('Verificación de sesión:', response);

        if (response && response.sesion_activa) {
          // Permitir el acceso si el usuario es administrador o usuario
          if (response.rol === 'adm' || response.rol === 'usuario') {
            return true; // Permite el acceso a la ruta
          } else {
            this.router.navigate(['/']); // Redirigir a la página principal si no tiene un rol permitido
            return false; // Bloquea el acceso
          }
        } else {
          console.warn('Sesión inactiva, redirigiendo a login...');
          this.router.navigate(['/login']); // Redirigir al login si no hay sesión activa
          return false; // Bloquea el acceso
        }
      })
    );
  }
}