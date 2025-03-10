import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CalificacionesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }
}