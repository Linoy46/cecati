import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map, catchError } from 'rxjs';
import { Course } from '../interfaces/course.interface';
import { Category } from '../interfaces/category.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost/cecati-login-backend'; //  URL

  constructor(private http: HttpClient) { }

  // --- Cursos ---

  getCourses(): Observable<Category[]> {
      return this.http.get<any>(`${this.apiUrl}/get_courses.php`).pipe(
          map(data => { // Usar any temporalmente, luego refinar
              const categories: Category[] = [];
              for (const catId in data) {
                  if (data.hasOwnProperty(catId)) {
                      const catData = data[catId];
                      if (catData) { //  catData
                          const category: Category = {
                              id: parseInt(catId), //  string a number
                              nombre: catData.nombre,
                              descripcion: catData.descripcion,
                              precio: parseFloat(catData.precio), //  string a float
                              cursos: Array.isArray(catData.cursos)
                                  ? catData.cursos.map((curso: any) => ({
                                      id: curso.id,
                                      nombre: curso.nombre,
                                      duracion_horas: curso.duracion_horas,
                                      hora_inicio: curso.hora_inicio,
                                      hora_termino: curso.hora_termino,
                                      categoriaId: parseInt(catData.id),
                                  }))
                                  : [],
                          };
                          categories.push(category);
                      }
                  }
              }
              return categories;
          }),
          catchError(this.handleError)
      );
  }
  createCourse(course: Course): Observable<ApiResponse<Course>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<ApiResponse<Course>>(`${this.apiUrl}/crear_curso.php`, course, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCourse(course: Course): Observable<ApiResponse<Course>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put<ApiResponse<Course>>(`${this.apiUrl}/act_curs.php`, course, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteCourse(id: number): Observable<ApiResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/delete_course.php?id=${id}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  // --- Categorías ---

    createCategory(category: Category): Observable<ApiResponse<Category>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/creacat.php`, category, httpOptions)
            .pipe(catchError(this.handleError));
    }

    updateCategory(category: Category): Observable<ApiResponse<Category>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/act_cat.php`, category, httpOptions)
            .pipe(catchError(this.handleError));
    }
    deleteCategory(id: number): Observable<ApiResponse<any>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/elimicat.php?id=${id}`, httpOptions)
            .pipe(catchError(this.handleError));
    }

  // --- Manejo de Errores (Centralizado) ---
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error.error || error.message || error}`;
       // Accede primero a error.error, si no existe a error.message, si no a error
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Lanza un nuevo error
  }
}