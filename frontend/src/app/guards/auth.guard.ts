import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService, AuthResponse } from '../services/auth.service';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        console.log("AuthGuard: Iniciando verificación de sesión");
        return this.authService.verificarSesion().pipe(
            map((response: AuthResponse) => {
                console.log('AuthGuard: Verificación de sesión:', response);

                if (response && response.sesion_activa) {
                    console.log("AuthGuard: Sesión activa");
                    this.authService.setCurrentUser(response);
                    console.log("AuthGuard: Usuario actual:", this.authService.getCurrentUser());

                    const expectedRole = route.data['expectedRole'];
                    console.log("AuthGuard: Rol esperado:", expectedRole);
                    console.log("AuthGuard: Rol del usuario:", response.rol);

                    if (expectedRole) {
                        if (response.rol !== expectedRole) {
                            console.log('AuthGuard: Rol incorrecto, redirigiendo a /');
                            return this.router.parseUrl('/');
                        }
                    }
                    console.log("AuthGuard: Acceso permitido");
                    return true;
                } else {
                    console.warn('AuthGuard: Sesión inactiva, redirigiendo a /login');
                    return this.router.parseUrl('/login');
                }
            }),
            catchError(error => {
                console.error('AuthGuard: Error al verificar sesión:', error);
                return of(this.router.parseUrl('/login'));
            })
        );
    }
}