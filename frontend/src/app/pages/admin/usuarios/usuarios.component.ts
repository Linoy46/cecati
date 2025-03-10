import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  categorias?: string[];
  cursos?: string[];
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', correo: '', rol: '' };
  usuarioSeleccionado: Usuario | null = null;
  categoriasUsuario: string[] = [];
  cursosUsuario: string[] = [];
  apiUrl = 'http://localhost/cecati-login/frontend/php.api/controllers/usuarios.php'; // Ajusta la ruta a tu backend PHP
  categoriasDisponibles: any[] = [];
  cursosDisponibles: any[] = [];
  categoriaSeleccionada: any = null;
  cursoSeleccionado: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCategoriasDisponibles();
    this.cargarCursosDisponibles();
  }

  cargarUsuarios(): void {
    this.http.get<Usuario[]>(`${this.apiUrl}?action=listar`).subscribe(data => {
      this.usuarios = data;
    });
  }

  crearUsuario(): void {
    this.http.post(`${this.apiUrl}?action=crear`, this.nuevoUsuario).subscribe(() => {
      this.cargarUsuarios();
      this.nuevoUsuario = { id: 0, nombre: '', correo: '', rol: '' };
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.cargarCategoriasUsuario(usuario.id);
    this.cargarCursosUsuario(usuario.id);
  }

  actualizarUsuario(): void {
    if (this.usuarioSeleccionado) {
      this.http.post(`${this.apiUrl}?action=actualizar`, this.usuarioSeleccionado).subscribe(() => {
        this.cargarUsuarios();
        this.usuarioSeleccionado = null;
      });
    }
  }

  eliminarUsuario(id: number): void {
    this.http.get(`${this.apiUrl}?action=eliminar&id=${id}`).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  cargarCategoriasUsuario(usuarioId: number): void {
    this.http.get<any[]>(`${this.apiUrl}?action=categorias&subAction=listar&usuarioId=${usuarioId}`)
      .subscribe(data => {
        this.categoriasUsuario = data.map(c => c.nombre);
      });
  }
    cargarCategoriasDisponibles(): void {
    this.http.get<any[]>(`${this.apiUrl}?action=obtenerCategorias`).subscribe(data => {
      this.categoriasDisponibles = data;
    });
  }

  agregarCategoriaUsuario(): void {
    if (this.usuarioSeleccionado && this.categoriaSeleccionada) {
      this.http.get(`${this.apiUrl}?action=categorias&subAction=agregar&usuarioId=${this.usuarioSeleccionado.id}&categoriaId=${this.categoriaSeleccionada.id}`).subscribe(() => {
        this.cargarCategoriasUsuario(this.usuarioSeleccionado!.id);
        this.categoriaSeleccionada = null;
      });
    }
  }

  eliminarCategoria(usuarioId: number, categoriaId: number): void {
    this.http.get(`${this.apiUrl}?action=categorias&subAction=eliminar&usuarioId=${usuarioId}&categoriaId=${categoriaId}`)
      .subscribe(() => {
        this.cargarCategoriasUsuario(usuarioId);
      });
  }

    cargarCursosUsuario(usuarioId: number): void {
    this.http.get<any[]>(`${this.apiUrl}?action=cursos&subAction=listar&usuarioId=${usuarioId}`)
      .subscribe(data => {
        this.cursosUsuario = data.map(c => c.nombre);
      });
  }

  cargarCursosDisponibles(): void {
    this.http.get<any[]>(`${this.apiUrl}?action=obtenerCursos`).subscribe(data => {
      this.cursosDisponibles = data;
    });
  }

  agregarCursoUsuario(): void {
    if (this.usuarioSeleccionado && this.cursoSeleccionado) {
      this.http.get(`${this.apiUrl}?action=cursos&subAction=agregar&usuarioId=${this.usuarioSeleccionado.id}&cursoId=${this.cursoSeleccionado.id}`).subscribe(() => {
        this.cargarCursosUsuario(this.usuarioSeleccionado!.id);
        this.cursoSeleccionado = null;
      });
    }
  }
  eliminarCurso(usuarioId: number, cursoId: number): void {
    this.http.get(`${this.apiUrl}?action=cursos&subAction=eliminar&usuarioId=${usuarioId}&cursoId=${cursoId}`)
      .subscribe(() => {
        this.cargarCursosUsuario(usuarioId);
      });
  }
}