import { Course } from './course.interface'; 

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;       
  cursos?: Course[];
}