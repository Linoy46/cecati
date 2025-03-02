import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  mensaje?: string;
  correo?: string;
  error?: string;
  sesion_activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/cecati-login-backend/auth.php';

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl,
      { correo, contrasena },
      { withCredentials: true } // Para enviar cookies de sesión
    );
  }

  //Método para cerrar sesión
  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}?logout=true`,
      {},
      { withCredentials: true }
    );
  }

  // verificar sesión 
  verificarSesion(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}?verificar=true`,
      {},
      { withCredentials: true }
    );
  }
}
