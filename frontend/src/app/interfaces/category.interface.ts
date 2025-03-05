import { Course } from './course.interface'; // Importante

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string; // Opcional
  precio: number;       //  precio
  cursos?: Course[];   // Opcional
}