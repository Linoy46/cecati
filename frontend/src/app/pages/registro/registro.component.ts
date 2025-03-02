import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, FormsModule, ReactiveFormsModule], // Add ReactiveFormsModule here
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  categoriasSeleccionadas: number[] = [];
  mensaje: string = '';
  categorias: { id: number, nombre: string }[] = [];

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.http.get<{ id: number, nombre: string }[]>('http://localhost/cecati-login-backend/categorias.php')
      .subscribe({
        next: (data) => {
          this.categorias = data;
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          this.mensaje = 'No se pudieron cargar las categorías.';
        }
      });
  }


  registrarUsuario() {
    if (!this.nombre || !this.correo || !this.contrasena || this.categoriasSeleccionadas.length === 0) {
      this.mensaje = 'Todos los campos son obligatorios y debes seleccionar al menos una categoría';
      return;
    }

    const usuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      categorias: this.categoriasSeleccionadas
    };

    this.http.post('http://localhost/cecati-login-backend/register.php', usuario).subscribe({
      next: (response: any) => {
        this.mensaje = response.mensaje || 'Usuario registrado con éxito';
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.mensaje = error.error?.error || 'Error al registrar usuario';
      }
    });
  }

  limpiarFormulario() {
    this.nombre = '';
    this.correo = '';
    this.contrasena = '';
    this.categoriasSeleccionadas = [];
  }

  goBack() {
    this.router.navigate(['/']); 
  }
}