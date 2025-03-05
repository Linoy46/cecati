import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Importa CurrencyPipe
import { CursoService } from '../../services/curso.service'; //  ruta correcta
import { Category } from '../../interfaces/category.interface'; //  ruta correcta

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css'],
  standalone: true,
  imports: [CommonModule], //  CurrencyPipe
})
export class TablasComponent implements OnInit {
  categories = signal<Category[]>([]);
  expandedCategories = signal<Set<number>>(new Set());
  loading = signal(true); //  para el estado de carga
  error = signal<string | null>(null); //  para los errores

  //  signal para evitar problemas de timing
  displayedCategories = computed(() => this.categories());

  constructor(private cursoService: CursoService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true); //  carga
    this.error.set(null);    //  errores
    this.cursoService.getCourses().subscribe({
      next: (categories: Category[]) => {
        this.categories.set(categories);
        this.loading.set(false); //  carga
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar los cursos.');
        this.loading.set(false); //  carga
      },
    });
  }

  toggleAccordion(categoryId: number) {
    const expanded = new Set(this.expandedCategories());
    expanded.has(categoryId) ? expanded.delete(categoryId) : expanded.add(categoryId);
    this.expandedCategories.set(expanded);
  }

  isExpanded(categoryId: number): boolean {
    return this.expandedCategories().has(categoryId);
  }
}