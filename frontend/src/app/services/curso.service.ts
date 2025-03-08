// src/app/services/curso.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../interfaces/course.interface';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost/cecati-login-backend'; // Base URL

  constructor(private http: HttpClient) { }

  // --- Cursos ---

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/get_courses_list.php`).pipe(
      catchError(this.handleError)
    );
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/crear_curso.php`, course).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/act_curs.php?id=${course.id}`, course).pipe(
      catchError(this.handleError)
    );
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete_course.php?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Categorías ---
    getAllCategorias(): Observable<Category[]>{
        return this.http.get<Category[]>(`${this.apiUrl}/get_categories.php`).pipe(
            catchError(this.handleError)
        )
    }
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/creacat.php`, category).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/act_cat.php?id=${category.id}`, category).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/elimicat.php?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

    getErrorMessage(error: HttpErrorResponse): string {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor.';
          } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado (Curso/Categoría).'; // Mensaje específico
          }else if (error.status === 400) { //  Bad Request
                errorMessage = error.error.error || 'Solicitud incorrecta.'; //  error message from the backend
            }
           else {
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
        }
        return errorMessage;
    }
    private handleError(error: HttpErrorResponse) { //  HttpErrorResponse

        return throwError(()=> new Error(this.getErrorMessage(error)));
    }
}