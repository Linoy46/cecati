import { Injectable, inject } from '@angular/core'; // Use inject
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'; // Import ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree
import { AuthService, AuthResponse } from '../services/auth.service';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Use inject() for dependencies
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot, // Add route parameter
    state: RouterStateSnapshot      // Add state parameter
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { // Return types

    return this.authService.verificarSesion().pipe(
      map((response: AuthResponse) => {
        console.log('Verificación de sesión:', response);

        if (response && response.sesion_activa) {
            //  Set the user in the AuthService *before* checking the role
            this.authService.setCurrentUser(response);

            // Check if the route has a 'data' property with an 'expectedRole'
            const expectedRole = route.data['expectedRole'];

            if (expectedRole) { //If is set a role
                //If the role does not match
                if(response.rol !== expectedRole){
                    console.log('Rol incorrecto, redirigiendo...');
                    // Redirect to home or a "not authorized" page
                    return this.router.parseUrl('/'); // Use parseUrl
                }
            }
            //If no expected role, or the role match
           return true;


        } else {
          console.warn('Sesión inactiva, redirigiendo a login...');
          // Redirect to login if no active session
          return this.router.parseUrl('/login'); // Use parseUrl for consistency
        }
      }),
      catchError(error => {
        console.error('Error al verificar sesión:', error);
        // Redirect to login on error
        return of(this.router.parseUrl('/login')); // Use of() and parseUrl
      })
    );
  }
}