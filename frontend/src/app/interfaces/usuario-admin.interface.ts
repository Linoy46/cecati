import { Category } from './category.interface';
import { Course } from './course.interface';

export interface UsuarioAdmin {
    id: number;
    nombre: string;
    correo: string;
    contrasena?: string; // Optional: only for create/edit
    rol: 'admin' | 'usuario';
    categorias: number[]; // Array of category IDs
    cursos: number[];     // Array of course IDs
}