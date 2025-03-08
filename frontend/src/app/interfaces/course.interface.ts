export interface Course {
  id: number;
  nombre: string;
  categoria_id: number; 
  duracion_horas?: number;  
  hora_inicio?: string;
  hora_termino?: string;
  nombre_categoria?: string;
}