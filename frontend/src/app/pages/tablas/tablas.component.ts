// src/app/pages/tablas/tablas.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Category } from '../../interfaces/category.interface';
import { Course } from '../../interfaces/course.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css'],
  standalone: true,
  imports: [CommonModule, ], // CurrencyPipe for formatting
})
export class TablasComponent implements OnInit {
  categories = signal<Category[]>([]);
  courses = signal<Course[]>([]);
  expandedCategories = signal<Set<number>>(new Set());
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private cursoService: CursoService) {}

  ngOnInit() {
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
        this.courses.set(courses);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Error al cargar los datos.');
        this.loading.set(false);
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

  getCoursesByCategory(categoryId: number): Course[] {
    return this.courses().filter((course) => course.categoria_id === categoryId);
  }
}