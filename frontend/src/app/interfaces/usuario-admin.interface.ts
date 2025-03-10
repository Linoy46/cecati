// src/app/interfaces/usuario-admin.interface.ts
export interface UsuarioAdmin {
    id: number;
    nombre: string;
    correo: string;
    rol: 'admin' | 'usuario';
    categorias: number[]; // Array of category IDs
    cursos: number[];    // Array of course IDs
    contrasena?: string; // Optional password (only for create/update)
  }