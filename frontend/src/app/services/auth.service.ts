import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AuthResponse {
    mensaje?: string;
    correo?: string;
    rol?: string;
    error?: string;
    sesion_activa: boolean;
    id?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost/cecati-login-backend/auth.php';
    private _currentUser = signal<AuthResponse | null>(null);

    constructor(private http: HttpClient) {}

    login(correo: string, contrasena: string): Observable<AuthResponse> {
        console.log("AuthService: Iniciando login");
        return this.http.post<AuthResponse>(
            this.apiUrl,
            { correo, contrasena },
            { withCredentials: true }
        ).pipe(
            catchError(error => {
                console.error("AuthService: Error de login:", error);
                let errorMessage = 'Error desconocido al iniciar sesión.';
                if (error.status === 0) {
                    errorMessage = 'No se pudo conectar con el servidor.';
                }
                return throwError(() => new Error(errorMessage));
            }),
            tap((response: AuthResponse) => {
                console.log("AuthService: Respuesta del servidor:", response);
                this.setCurrentUser(response);
                console.log("AuthService: Usuario actual después del login:", this.getCurrentUser());
            })
        );
    }

    logout(): Observable<AuthResponse> {
        console.log("AuthService: Iniciando logout");
        return this.http.post<AuthResponse>(
            `${this.apiUrl}?logout=true`,
            {},
            { withCredentials: true }
        ).pipe(
            catchError(error => {
                console.error("AuthService: Error de logout:", error);
                let errorMessage = 'Error desconocido al cerrar sesión.';
                if (error.status === 0) {
                    errorMessage = 'No se pudo conectar con el servidor.';
                }
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    verificarSesion(): Observable<AuthResponse> {
        console.log("AuthService: Iniciando verificación de sesión");
        return this.http.post<AuthResponse>(
            `${this.apiUrl}?verificar=true`,
            {},
            { withCredentials: true }
        ).pipe(
            catchError(error => {
                console.error("AuthService: Error de verificación de sesión:", error);
                let errorMessage = 'Error desconocido al verificar la sesión.';
                if (error.status === 0) {
                    errorMessage = 'No se pudo conectar con el servidor.';
                }
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getCurrentUser(): AuthResponse | null {
        return this._currentUser();
    }

    setCurrentUser(user: AuthResponse | null): void {
        this._currentUser.set(user);
    }
}