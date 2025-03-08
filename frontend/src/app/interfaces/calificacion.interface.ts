export interface Calificacion {
    id: number;
    usuario_id: number;
    curso_id: number;
    calificacion: number;
    nombre_usuario?: string;
    nombre_curso?: string;  
  }