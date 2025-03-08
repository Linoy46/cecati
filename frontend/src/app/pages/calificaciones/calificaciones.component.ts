import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionService } from '../../services/calificacion.service'; // Update path
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { Calificacion } from '../../interfaces/calificacion.interface'; // Update path
import { CursoService } from '../../services/curso.service'; // Import CursoService
import { Course } from '../../interfaces/course.interface'; // Import Course interface
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CalificacionesComponent implements OnInit {

  private calificacionService = inject(CalificacionService);
  private authService = inject(AuthService);
  private cursoService = inject(CursoService); // Inject CursoService

  // Signals
  calificaciones = signal<Calificacion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  courses = signal<Course[]>([]); // Signal for courses

    // Computed signal to join course names with qualifications
    calificacionesToShow = computed(() => {
        return this.calificaciones().map(calif => {
            const curso = this.courses().find(c => c.id === calif.curso_id);
            return {
                ...calif,
                nombre_curso: curso ? curso.nombre : 'Curso Desconocido',  // Handle missing course
                nombre_categoria: curso? curso.nombre_categoria : 'Categoría desconocida'
            };
        });
    });

  constructor() {
    // Effect to load qualifications when the user changes.  This is VERY important.
    effect(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.id) {
        this.loadCalificaciones(currentUser.id);
      } else {
        // No user logged in (or user data not loaded yet)
        this.calificaciones.set([]);
        this.loading.set(false);
        this.error.set(null);
      }
    });
  }

  ngOnInit(): void {
      this.loadCourses(); // Load courses *once*
  }

    loadCourses() {
        this.cursoService.getAllCourses().subscribe({
            next: (courses) => this.courses.set(courses),
            error: (err: HttpErrorResponse) => { // Type the error
                this.error.set(this.cursoService.getErrorMessage(err)); // Use centralized error handling
                this.loading.set(false); // Set loading to false even on error
            }
        });
    }
  loadCalificaciones(userId: number) {
    this.loading.set(true);
    this.error.set(null);

    this.calificacionService.getCalificacionesByUser(userId).subscribe({
      next: (calificaciones) => {
          if (Array.isArray(calificaciones)) { // Check if it's an array
              this.calificaciones.set(calificaciones);
          } else {
              // Handle unexpected response (e.g., server error returning an object instead of array)
              this.error.set('Respuesta inesperada del servidor.');
          }

        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => { // Use HttpErrorResponse
        this.error.set(this.calificacionService.getErrorMessage(err)); // Centralized error handling
        this.loading.set(false); // Set loading to false on error.
      }
    });
  }
}