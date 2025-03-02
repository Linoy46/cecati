import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css']
})
export class CalificacionesComponent {
  alumno = {
    nombre: '[Nombre del alumno]',
    matricula: '[Matrícula]'
  };

  calificaciones = [
    { profesor: '[Nombre del profesor]', materia: '[Nombre de la materia]', final: '' },
 
  ];
}