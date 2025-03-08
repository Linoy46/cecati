import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Calificacion } from '../interfaces/calificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = 'http://localhost/cecati-login-backend/calificaciones.php';

  constructor(private http: HttpClient) { }

  getCalificacionesByUser(userId: number): Observable<Calificacion[]> {
    const url = `${this.apiUrl}?usuario_id=${userId}`;
    return this.http.get<Calificacion[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  createCalificacion(calificacion: Calificacion): Observable<Calificacion> {
    return this.http.post<Calificacion>(this.apiUrl, calificacion).pipe(
      catchError(this.handleError)
    );
  }

  updateCalificacion(calificacion: Calificacion): Observable<Calificacion> {
    return this.http.put<Calificacion>(`${this.apiUrl}?id=${calificacion.id}`, calificacion).pipe(
      catchError(this.handleError)
    );
  }

  deleteCalificacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`).pipe(
      catchError(this.handleError)
    );
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
        errorMessage = 'No se encontraron calificaciones.'; // Mensaje más específico
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