import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; // Import HttpErrorResponse
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuarioAdmin } from '../interfaces/usuario-admin.interface';
import { ApiResponse } from '../interfaces/api-response.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/cecati-login-backend'; //  URL base

  constructor(private http: HttpClient) { }

  // --- Usuarios ---

  getUsuarios(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(`${this.apiUrl}/get_usuarios.php`)
      .pipe(catchError(this.handleError));
  }


    createUsuario(usuario: UsuarioAdmin): Observable<ApiResponse<UsuarioAdmin>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<ApiResponse<UsuarioAdmin>>(`${this.apiUrl}/crear_usuario.php`, usuario, httpOptions)
            .pipe(catchError(this.handleError));
    }

    updateUsuario(usuario: UsuarioAdmin): Observable<ApiResponse<UsuarioAdmin>> {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
        return this.http.put<ApiResponse<UsuarioAdmin>>(`${this.apiUrl}/act_usu.php`, usuario, httpOptions)
            .pipe(catchError(this.handleError));
    }
  deleteUsuario(id: number): Observable<ApiResponse<any>> {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/eliminar_usuario.php?id=${id}`, httpOptions)
      .pipe(catchError(this.handleError));
  }


  // --- Centralized Error Handling ---
  getErrorMessage(error: HttpErrorResponse): string { //  HttpErrorResponse
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado (Usuario).'; // Mensaje más específico
      } else if (error.status === 400) {
        errorMessage = error.error.error || 'Solicitud incorrecta.';
      } else {
        errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }
    return errorMessage;
  }
    private handleError(error: HttpErrorResponse) { //  HttpErrorResponse

        return throwError(()=> new Error(this.getErrorMessage(error)));
    }
}