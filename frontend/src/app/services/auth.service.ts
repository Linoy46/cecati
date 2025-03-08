import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Import throwError
import { catchError } from 'rxjs/operators';


export interface AuthResponse {
  mensaje?: string;
  correo?: string;
  rol?: string;
  error?: string;
  sesion_activa: boolean;
  id?: number; // Add ID.  VERY important for getting user's grades.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/cecati-login-backend/auth.php';
  private _currentUser = signal<AuthResponse | null>(null); // Signal for current user

  constructor(private http: HttpClient) {}

  // Method to log in
  login(correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl,
      { correo, contrasena },
      { withCredentials: true } // To send session cookies
    ).pipe(
      catchError(error => {  // Add error handling
        console.error("Login Error:", error);
        let errorMessage = "Error desconocido al iniciar sesión.";
        if (error.status === 0) {
          errorMessage = "No se pudo conectar con el servidor."; // No connection
        } else if (error.status === 400) {
          errorMessage = "Datos incorrectos"; //Or whatever error your API returns
        } else if (error.status === 401) {
          errorMessage = "Credenciales incorrectas."
        }
        //  return an observable that emits an error.
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Method to log out
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}?logout=true`,
      {},
      { withCredentials: true }
    ).pipe(
        catchError(error => {
            console.error("Logout error:", error);
            let errorMessage = 'Error desconocido al cerrar sesión.';
            if (error.status === 0) {
                errorMessage = 'No se pudo conectar con el servidor.';
            }
            return throwError(()=> new Error(errorMessage));

        })
      );
  }

  // Verify session
    verificarSesion(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}?verificar=true`,
      {},
      { withCredentials: true }
    ).pipe(
        catchError(error => {
            console.error("Verification error: ", error);
            let errorMessage = 'Error desconocido al verificar la sesion.';
             if (error.status === 0) {
                errorMessage = 'No se pudo conectar con el servidor.';
            }
            return throwError(()=> new Error(errorMessage));
        })
    );
  }

    //  method to get the *current user* (or null if not logged in)
    getCurrentUser(): AuthResponse | null {
        return this._currentUser();
    }

    //  method to SET the current user (call this after login)
    setCurrentUser(user: AuthResponse | null): void {
        this._currentUser.set(user);
    }
}