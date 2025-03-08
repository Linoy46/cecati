import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service'; //  ruta correcta
import { CursoService } from '../../../services/curso.service';   //  ruta correcta
import { UsuarioAdmin } from '../../../interfaces/usuario-admin.interface'; //  ruta correcta
import { Category } from '../../../interfaces/category.interface';       //  ruta correcta
import { Course } from '../../../interfaces/course.interface';          //  ruta correcta
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms'; //  FormsModule si usas ngModel
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-admin-usuarios',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule], //  FormsModule
    templateUrl: './admin-usuarios.component.html',
    styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

    private usuarioService = inject(UsuarioService);
    private cursoService = inject(CursoService);
    private fb = inject(FormBuilder);

    usuarios = signal<UsuarioAdmin[]>([]);
    categorias = signal<Category[]>([]);
    cursos = signal<Course[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);
    expandedUsers = signal<Set<number>>(new Set());
    showCreateModal = signal(false);
    showEditModal = signal(false);
    selectedUsuario = signal<UsuarioAdmin | null>(null);

    usuarioForm: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: [''], // Opcional al editar
        rol: ['usuario', Validators.required],  // Valor por defecto
        categorias: [[]], // Array para ng-select (IDs)
        cursos: [[]]     // Array para ng-select (IDs)
    });

    // Computed signal para combinar datos
    usuariosToShow = computed(() => {
        return this.usuarios().map(usuario => {
            const categoriasUsuario = usuario.categorias
                ? usuario.categorias.map(catId => {
                    const categoria = this.categorias().find(c => c.id === catId);
                    return categoria ? categoria.nombre : 'Categoría Desconocida';
                }).join(', ')
                : 'Ninguna';

            const cursosUsuario = usuario.cursos
                ? usuario.cursos.map(cursoId => {
                    const curso = this.cursos().find(c => c.id === cursoId);
                    return curso ? curso.nombre : 'Curso Desconocido';
                }).join(', ')
                : 'Ninguno';

            return {
                ...usuario,
                categoriasNombres: categoriasUsuario,
                cursosNombres: cursosUsuario
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
                catchError((err: HttpErrorResponse) => {
                    this.error.set(this.usuarioService.getErrorMessage(err));
                    this.loading.set(false);
                    return of([]); //  array vacío en caso de error
                })
            ),
            categorias: this.cursoService.getAllCategorias().pipe(
                catchError((err: HttpErrorResponse) => {
                    this.error.set(this.cursoService.getErrorMessage(err));
                    this.loading.set(false);
                    return of([]);
                })
            ),
            cursos: this.cursoService.getAllCourses().pipe(
                catchError((err: HttpErrorResponse) => {
                    this.error.set(this.cursoService.getErrorMessage(err));
                    this.loading.set(false);
                    return of([]);
                })
            )
        }).subscribe({
            next: ({ usuarios, categorias, cursos }) => {
                this.usuarios.set(usuarios);
                this.categorias.set(categorias);
                this.cursos.set(cursos);
                this.loading.set(false);
            },
           // No necesitamos el bloque 'error' aquí porque ya lo manejamos individualmente
        });
    }


    // --- Crear Usuario ---

    openCreateModal() {
        this.usuarioForm.reset({ rol: 'usuario' }); // Valores por defecto
        this.error.set(null); // Limpiar errores
        this.showCreateModal.set(true);
    }
    closeCreateModal() {
        this.showCreateModal.set(false);
    }

    createUsuario() {
        if (this.usuarioForm.invalid) {
            this.usuarioForm.markAllAsTouched(); // Mostrar errores de validación
            return;
        }

        const userData = this.usuarioForm.value;
        const newUser: UsuarioAdmin = {
            id: 0, // ID temporal, el backend lo generará
            nombre: userData.nombre,
            correo: userData.correo,
            contrasena: userData.contrasena,
            rol: userData.rol,
            categorias: userData.categorias || [], //  arrays vacíos
            cursos: userData.cursos || []          //  arrays vacíos
        };

        this.usuarioService.createUsuario(newUser).subscribe({
            next: () => {
                this.loadData(); // Recargar usuarios
                this.closeCreateModal();
            },
            error: (err: HttpErrorResponse) => {
                this.error.set(this.usuarioService.getErrorMessage(err)); // Usar el servicio
            }
        });
    }


    // --- Editar Usuario ---

    openEditModal(usuario: UsuarioAdmin) {
      this.selectedUsuario.set({ ...usuario }); //  copia del usuario

      this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasena: '', // No rellenar la contraseña al editar
            rol: usuario.rol,
            categorias: usuario.categorias || [], //  arrays
            cursos: usuario.cursos || []          //  arrays
        });
        this.error.set(null); // Limpiar errores
        this.showEditModal.set(true);
    }

    closeEditModal() {
        this.selectedUsuario.set(null);
        this.showEditModal.set(false);
    }


    updateUsuario() {
        if (this.usuarioForm.invalid || !this.selectedUsuario()) {
            this.usuarioForm.markAllAsTouched();
            return;
        }

        const userData = this.usuarioForm.value;
        const updatedUser: UsuarioAdmin = {
            id: this.selectedUsuario()!.id, // ID del usuario existente
            nombre: userData.nombre,
            correo: userData.correo,
            contrasena: userData.contrasena, // Podría estar vacía
            rol: userData.rol,
            categorias: userData.categorias || [],
            cursos: userData.cursos || []
        };

        this.usuarioService.updateUsuario(updatedUser).subscribe({
            next: () => {
                this.loadData();
                this.closeEditModal();
            },
            error: (err: HttpErrorResponse) => {
                this.error.set(this.usuarioService.getErrorMessage(err)); // Usar el servicio
            }
        });
    }

    // --- Eliminar Usuario ---

    deleteUsuario(id: number) {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            this.usuarioService.deleteUsuario(id).subscribe({
                next: () => {
                    this.loadData();
                },
                error: (err: HttpErrorResponse) => {
                    this.error.set(this.usuarioService.getErrorMessage(err));
                }
            });
        }
    }

      // --- Funciones Auxiliares ---
    //Expandir Cursos.
    toggleUserCourses(userId: number) {
        const expanded = new Set(this.expandedUsers());
        if (expanded.has(userId)) {
            expanded.delete(userId);
        } else {
            expanded.add(userId);
        }
        this.expandedUsers.set(expanded);
    }
    //Verificar si está expandido.
    isExpanded(userId: number): boolean {
        return this.expandedUsers().has(userId);
    }
     trackById(index: number, item: any): any {
          return item.id; //  'id' is a unique property of your items
        }
}