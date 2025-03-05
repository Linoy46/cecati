import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { CursoService } from '../../../services/curso.service'; //  ruta
import { Category } from '../../../interfaces/category.interface';
import { Course } from '../../../interfaces/course.interface';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-admin-contenido',
  templateUrl: './admin-contenido.component.html',
  styleUrls: ['./admin-contenido.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
})
export class AdminContenidoComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = true;
  error: string | null = null;
  showCreateCourseModal = false;
  showEditCourseModal = false;
    showEditCategoryModal = false; //Modal para categoria
  newCourse: Course = this.getEmptyCourse();
  selectedCourse: Course | null = null;
    selectedCategory: Category | null = null; //Categoria seleccionada

  constructor(private cursoService: CursoService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

    // --- Cursos ---
  loadCourses() {
    this.loading = true;
    this.error = null;
    this.cursoService.getCourses().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar los cursos.';
        this.loading = false;
      }
    });
  }

    getEmptyCourse(): Course {
        return {
          id: 0,
          nombre: '',
          duracion_horas: 0,
          hora_inicio: '',
          hora_termino: '',
          categoriaId: 0
        };
    }
  openCreateCourseModal() {
    this.newCourse = this.getEmptyCourse();
    this.showCreateCourseModal = true;
  }

  closeCreateCourseModal() {
    this.showCreateCourseModal = false;
  }

  openEditCourseModal(course: Course) {
    this.selectedCourse = { ...course };  // Copia
    this.showEditCourseModal = true;
  }

  closeEditCourseModal() {
    this.selectedCourse = null;
    this.showEditCourseModal = false;
  }

  createCourse() {
    if (!this.newCourse.nombre || !this.newCourse.duracion_horas || !this.newCourse.hora_inicio || !this.newCourse.hora_termino || !this.newCourse.categoriaId) {
      alert('Por favor, complete todos los campos del curso.');
      return;
    }

    this.cursoService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.loadCourses();
        this.closeCreateCourseModal();
      },
      error: (err) => {
        this.error = err.message || 'Error al crear el curso.';
      }
    });
  }

  updateCourse() {
    if (!this.selectedCourse?.nombre || !this.selectedCourse.duracion_horas || !this.selectedCourse.hora_inicio || !this.selectedCourse.hora_termino || !this.selectedCourse.categoriaId) {
      alert('Por favor, complete todos los campos del curso.');
      return;
    }

    if (this.selectedCourse) {
        this.cursoService.updateCourse(this.selectedCourse).subscribe({
          next: () => {
            this.loadCourses();
            this.closeEditCourseModal();
          },
          error: (err) => {
            this.error = err.message || 'Error al actualizar el curso.';
          }
        });
    }
  }

  deleteCourse(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este curso?')) {
      this.cursoService.deleteCourse(id).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar el curso.';
        }
      });
    }
  }

    // --- Categorías ---

    openEditCategoryModal(category: Category) {
        this.selectedCategory = { ...category }; //  copia
        this.showEditCategoryModal = true;
    }

    closeEditCategoryModal() {
        this.selectedCategory = null;
        this.showEditCategoryModal = false;
    }
    updateCategory() {
    if (!this.selectedCategory?.nombre || !this.selectedCategory.precio) {
      alert('Por favor, complete el nombre y el precio de la categoría.');
      return;
    }

    if (this.selectedCategory) {
      this.cursoService.updateCategory(this.selectedCategory).subscribe({
        next: () => {
          this.loadCourses();  // Recarga *todo* (cursos y categorías)
          this.closeEditCategoryModal();
        },
        error: (err) => {
          this.error = err.message || 'Error al actualizar la categoría.';
        }
      });
    }
  }
    createCategory() {
        //Se crea una variable de tipo Category
      let newCategory : Category = {id: 0, nombre:"", precio: 0}

    if (!newCategory.nombre) {
      alert('Por favor ingrese un nombre para la categoría.');
      return;
    }
     if (!newCategory.precio) {
      alert('Por favor ingrese el precio de la categoría.');
      return;
    }

    //Se crea la categoria
    this.cursoService.createCategory(newCategory).subscribe({
      next: () => {
        this.loadCourses();  // Recarga *todo* (cursos y categorías)
        this.closeEditCategoryModal();
      },
      error: (err) => {
        this.error = err.message || 'Error al crear la categoría.';
      }
    });

  }

    deleteCategory(categoryId: number){
         if (confirm('¿Está seguro de que desea eliminar esta categoría? Esto también eliminará todos los cursos asociados.')) {
            this.cursoService.deleteCategory(categoryId).subscribe({
                next: () => {
                    this.loadCourses(); //Recarga
                },
                error: (err) => {
                    this.error = err.message || 'Error al eliminar la categoría';
                }
            })
         }
    }
}