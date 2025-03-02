import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {
  especialidades = [
    'Administración',
    'Alimentos y Bebidas',
    'Aplicación de Normas y Procedimientos Contables y Fiscales',
    'Asistencia Ejecutiva',
    'Diseño de Moda',
    'Elaboración de Dibujos Arquitectónico e Industrial',
    'Estilismo y Diseño de Imagen',
    'Soporte Técnico a Equipos y Sistemas Computacionales',
    'Uso de la Lengua Inglesa en Diversos Contextos',
    'Informática'
  ];

  cursos = [
    { nombre: 'Elaboración de Documentos mediante un Procesador de Textos', especialidad: '....detalles' },
    { nombre: 'Soporte Técnico a Equipos y Sistemas Computacionale', especialidad: '....detalles' },

  ];
}