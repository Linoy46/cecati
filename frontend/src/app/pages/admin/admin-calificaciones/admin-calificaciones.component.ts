import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalificacionService } from '../../../services/calificacion.service';
import { Calificacion } from '../../../interfaces/calificacion.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { CursoService } from '../../../services/curso.service';
import { UsuarioAdmin } from '../../../interfaces/usuario-admin.interface';
import { Course } from '../../../interfaces/course.interface';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Import 'catchError'
import { of } from 'rxjs'; // Import the 'of' operator
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-admin-calificaciones',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule],
    templateUrl: './admin-calificaciones.component.html',
    styleUrls: ['./admin-calificaciones.component.css']
})
export class AdminCalificacionesComponent implements OnInit {

    private calificacionService = inject(CalificacionService);
    private usuarioService = inject(UsuarioService);
    private cursoService = inject(CursoService);
    private fb = inject(FormBuilder); // Inject FormBuilder

    // Signals
    calificaciones = signal<Calificacion[]>([]);
    usuarios = signal<UsuarioAdmin[]>([]);
    cursos = signal<Course[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    showCreateModal = signal(false);
    showEditModal = signal(false);
    selectedCalificacion = signal<Calificacion | null>(null);

     // Formulario (Reactive Forms)
    calificacionForm: FormGroup = this.fb.group({
        usuario_id: [null, Validators.required], //  null initial value
        curso_id: [null, Validators.required],
        calificacion: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
    });

    // Computed signal to join course and user names
    calificacionesToShow = computed(() => {
        return this.calificaciones().map(calif => {
            const curso = this.cursos().find(c => c.id === calif.curso_id);
            const usuario = this.usuarios().find(u => u.id === calif.usuario_id);

            return {
                ...calif,
                nombre_curso: curso ? curso.nombre : 'Curso Desconocido',
                nombre_usuario: usuario ? usuario.nombre : 'Usuario Desconocido'
            };
        });
    });
    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.error.set(null);

        forkJoin({
            usuarios: this.usuarioService.getUsuarios().pipe(
                catchError(err => {
                  this.error.set(this.usuarioService.getErrorMessage(err)); // Use usuarioService
                  return of([]); // Return an empty array to continue execution
                })
              ),
              cursos: this.cursoService.getAllCourses().pipe(
                catchError(err => {
                  this.error.set(this.cursoService.getErrorMessage(err));  // Use cursoService
                  return of([]);
                })
              ),
              calificaciones: this.calificacionService.getCalificaciones().pipe(
                catchError(err => {
                  this.error.set(this.calificacionService.getErrorMessage(err)); // Use calificacionService
                  return of([]);
                })
              )
        }).subscribe({
            next: ({ usuarios, cursos, calificaciones }) => {
                this.usuarios.set(usuarios);
                this.cursos.set(cursos);
                this.calificaciones.set(calificaciones);
                this.loading.set(false);
            },
             // No error handler here, individual errors are handled above
        });
    }

    // --- Create ---
    openCreateModal() {
        this.calificacionForm.reset();
        this.error.set(null); // Clear error
        this.showCreateModal.set(true);
    }

    closeCreateModal() {
        this.showCreateModal.set(false);
    }
    createCalificacion() {
        if (this.calificacionForm.invalid) {
            this.calificacionForm.markAllAsTouched(); //  validation errors
            return;
        }

        const newCalificacion: Calificacion = this.calificacionForm.value;

        this.calificacionService.createCalificacion(newCalificacion).subscribe({
            next: (createdCalificacion) => {
                 //  add the new grade to the signal
                this.calificaciones.update(currentCalificaciones => [...currentCalificaciones, createdCalificacion]);
                this.closeCreateModal();
                this.loadData(); //  reload to ensure consistency.

            },
            error: (err: HttpErrorResponse) => this.error.set(this.calificacionService.getErrorMessage(err))
        });
    }

    // --- Edit ---
    openEditModal(calificacion: Calificacion) {
        this.selectedCalificacion.set({ ...calificacion }); // Create a copy.
        this.calificacionForm.patchValue(calificacion);
        this.error.set(null); // Clear error
        this.showEditModal.set(true);
    }

    closeEditModal() {
        this.selectedCalificacion.set(null);
        this.showEditModal.set(false);
    }

    updateCalificacion() {
        if (this.calificacionForm.invalid || !this.selectedCalificacion()) {
            this.calificacionForm.markAllAsTouched();  //  validation errors
            return;
        }

        const updatedCalificacion: Calificacion = {
            id: this.selectedCalificacion()!.id, //  ID
            ...this.calificacionForm.value      //  form
        };

        this.calificacionService.updateCalificacion(updatedCalificacion).subscribe({
            next: () => {
                 //  update the signal
                this.calificaciones.update(currentCalificaciones =>
                    currentCalificaciones.map(calif =>
                        calif.id === updatedCalificacion.id ? updatedCalificacion : calif
                    )
                );
                this.closeEditModal();
                this.loadData(); //  reload data
            },
            error: (err: HttpErrorResponse) => this.error.set(this.calificacionService.getErrorMessage(err))

        });
    }


    // --- Delete ---
    deleteCalificacion(id: number) {
        if (confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
            this.calificacionService.deleteCalificacion(id).subscribe({
                next: () => {
                    //  remove from signal
                    this.calificaciones.update(currentCalificaciones =>
                        currentCalificaciones.filter(calif => calif.id !== id)
                      );
                      this.loadData(); //  consistency
                },
                error: (err: HttpErrorResponse) => this.error.set(this.calificacionService.getErrorMessage(err))
            });
        }
    }

    // Helper functions (optional, but good for readability)
    getUsuarioName(usuarioId: number): string {
        const usuario = this.usuarios().find(u => u.id === usuarioId);
        return usuario ? usuario.nombre : 'Usuario Desconocido';
    }

    getCursoName(cursoId: number): string {
        const curso = this.cursos().find(c => c.id === cursoId);
        return curso ? curso.nombre : 'Curso Desconocido';
    }
}