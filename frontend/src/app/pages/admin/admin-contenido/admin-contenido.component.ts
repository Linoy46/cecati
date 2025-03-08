import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { CursoService } from '../../../services/curso.service';
import { Category } from '../../../interfaces/category.interface';
import { Course } from '../../../interfaces/course.interface';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { forkJoin } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpErrorResponse } from '@angular/common/http';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-admin-contenido',
  templateUrl: './admin-contenido.component.html',
  styleUrls: ['./admin-contenido.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, NgSelectModule],
})
export class AdminContenidoComponent implements OnInit {
  categories = signal<Category[]>([]);
  courses = signal<Course[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showCreateCourseModal = signal(false);
  showEditCourseModal = signal(false);
  showEditCategoryModal = signal(false);
  showCreateCategoryModal = signal(false);
  selectedCourse = signal<Course | null>(null);
  selectedCategory = signal<Category | null>(null);

  newCourse: Course = {
    id: 0,
    nombre: '',
    categoria_id: 0,
    duracion_horas: 0,
    hora_inicio: '',
    hora_termino: '',
  };

  newCategory: Category = {
    id: 0,
    nombre: '',
    precio: 0,
    descripcion: '', // Initialize description
  };

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      courses: this.cursoService.getAllCourses(),
      categories: this.cursoService.getAllCategorias(),
    }).subscribe({
      next: ({ courses, categories }) => {
        const categoryLookup: { [key: number]: string } = {};
        categories.forEach((cat) => (categoryLookup[cat.id] = cat.nombre));

        const coursesWithCategoryNames = courses.map((course) => ({
          ...course,
          nombre_categoria: categoryLookup[course.categoria_id] || 'Sin categoría',
        }));

        this.courses.set(coursesWithCategoryNames);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(this.cursoService.getErrorMessage(err)); // Use centralized error handling
        this.loading.set(false);
      },
    });
  }

    // --- Cursos ---
    openCreateCourseModal() {
        this.newCourse = {
            id: 0,
            nombre: '',
            categoria_id: 0,
            duracion_horas: 0,
            hora_inicio: '',
            hora_termino: ''
        };
        this.error.set(null); // Clear error message
        this.showCreateCourseModal.set(true);
    }

  closeCreateCourseModal() {
    this.showCreateCourseModal.set(false);
  }

  openEditCourseModal(course: Course) {
    this.selectedCourse.set({ ...course });
    this.showEditCourseModal.set(true);
  }

  closeEditCourseModal() {
    this.selectedCourse.set(null);
    this.showEditCourseModal.set(false);
  }

    createCourse() {
        if (!this.newCourse.nombre || !this.newCourse.duracion_horas || !this.newCourse.categoria_id ||
            !this.newCourse.hora_inicio || !this.newCourse.hora_termino) {
            alert('Por favor, complete todos los campos del curso.');
            return; // Stop execution if validation fails
        }

        this.cursoService.createCourse(this.newCourse).subscribe({
            next: () => {
                this.loadData();
                this.closeCreateCourseModal();
            },
            error: (err: HttpErrorResponse) => { // Use HttpErrorResponse
                this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
            }
        });
    }

    updateCourse() {
        if (!this.selectedCourse()?.nombre || !this.selectedCourse()?.duracion_horas
            || !this.selectedCourse()?.hora_inicio || !this.selectedCourse()?.hora_termino
            || !this.selectedCourse()?.categoria_id) {
            alert('Por favor, complete todos los campos del curso.');

            return;  // Stop execution if validation fails
        }

        if (this.selectedCourse()) {
            this.cursoService.updateCourse(this.selectedCourse()!).subscribe({
                next: () => {
                    this.loadData();
                    this.closeEditCourseModal();
                },
                error: (err: HttpErrorResponse) => { // Use HttpErrorResponse
                    this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
                }
            });
        }
    }

    deleteCourse(id: number) {
        if (confirm('¿Está seguro de que desea eliminar este curso?')) {
            this.cursoService.deleteCourse(id).subscribe({
                next: () => {
                    this.loadData();
                },
                error: (err: HttpErrorResponse) => { // Use HttpErrorResponse
                    this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
                }
            });
        }
    }

    // --- Categorías ---
    openCreateCategoryModal() {
        this.newCategory = {
            id: 0,
            nombre: '',
            precio: 0,
            descripcion: ''
        };
        this.error.set(null); // Clear error message
        this.showCreateCategoryModal.set(true);
    }

  closeCreateCategoryModal() {
    this.showCreateCategoryModal.set(false);
  }

  openEditCategoryModal(category: Category) {
    this.selectedCategory.set({ ...category });
    this.showEditCategoryModal.set(true);
  }

  closeEditCategoryModal() {
    this.selectedCategory.set(null);
    this.showEditCategoryModal.set(false);
  }

  updateCategory() {
    if (!this.selectedCategory()?.nombre || !this.selectedCategory()?.precio) {
      alert('Por favor, complete el nombre y el precio de la categoría.');
      return;
    }
    if (this.selectedCategory()) {
      this.cursoService.updateCategory(this.selectedCategory()!).subscribe({
        next: () => {
          this.loadData();
          this.closeEditCategoryModal();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
        },
      });
    }
  }

  createCategory() {
    if (!this.newCategory.nombre || !this.newCategory.precio) {
      alert('Por favor ingrese un nombre y precio para la categoría.');
      return;
    }

    this.cursoService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.loadData();
        this.closeCreateCategoryModal();
        this.newCategory = { id: 0, nombre: '', precio: 0, descripcion: '' }; // Clear form
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
      },
    });
  }
  deleteCategory(categoryId: number) {
    if (confirm('¿Está seguro de que desea eliminar esta categoría? Esto también eliminará todos los cursos asociados.')) {
      this.cursoService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(this.cursoService.getErrorMessage(err)); // Centralized error handling
        },
      });
    }
  }
}