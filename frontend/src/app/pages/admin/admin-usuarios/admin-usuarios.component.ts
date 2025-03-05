import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Categoria {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena?: string;
  rol: string;
  categorias: Categoria[];
}

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  categorias: Categoria[] = [];
  usuarioForm: FormGroup;
  editando: boolean = false;
  usuarioEditando: Usuario | null = null;
  mostrarContrasena: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  categoriasSeleccionadas: boolean[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: [''],
      rol: ['usuario', Validators.required],
    });
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarUsuarios() {
    this.loading = true;
    this.error = null;
    this.usuarioForm.disable();

    this.http.get<Usuario[]>('http://localhost/cecati-login-backend/usuarios.php')
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios.map(usuario => ({
            ...usuario,
            categorias: usuario.categorias.map(categoriaDesdeBD =>
              this.categorias.find(c => c.id === categoriaDesdeBD.id) || { id: 0, nombre: '' }
            )
          }));
          this.loading = false;
          this.usuarioForm.enable();
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
            if (error && error.error && error.error.error) {
                this.error = error.error.error;
            } else {
                this.error = 'Error al cargar usuarios. Inténtalo de nuevo.';
            }
          this.loading = false;
          this.usuarioForm.enable();
        }
      });
  }

  cargarCategorias() {
    this.loading = true;
    this.error = null;
    this.usuarioForm.disable();
    this.http.get<Categoria[]>('http://localhost/cecati-login-backend/categorias.php')
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
          this.categoriasSeleccionadas = this.categorias.map(() => false);
          this.cargarUsuarios();
          this.loading = false;
          this.usuarioForm.enable();
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
            if (error && error.error && error.error.error) {
                this.error = error.error.error;
            } else {
                this.error = 'Error al cargar categorías. Inténtalo de nuevo.';
            }
          this.loading = false;
          this.usuarioForm.enable();
        }
      });
  }

  guardarUsuario() {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.usuarioForm.disable();

    const usuario: Usuario = {
      id: this.usuarioEditando ? this.usuarioEditando.id : 0,
      ...this.usuarioForm.value,
      categorias: this.categorias.filter((_, index) => this.categoriasSeleccionadas[index]),
    };

    if (this.editando && !this.usuarioForm.value.contrasena) {
      delete usuario.contrasena;
    }

    const request = this.editando
      ? this.http.put('http://localhost/cecati-login-backend/usuarios.php', usuario)
      : this.http.post('http://localhost/cecati-login-backend/usuarios.php', usuario);

    request.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cancelarEdicion();
        this.loading = false;
        this.usuarioForm.enable();
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
          if (error && error.error && error.error.error) {
                this.error = error.error.error;
            } else {
                this.error = 'Error al guardar el usuario. Inténtalo de nuevo.';
            }
        this.loading = false;
        this.usuarioForm.enable();
      }
    });
  }

  editarUsuario(usuario: Usuario) {
    this.editando = true;
    this.usuarioEditando = usuario;
    this.error = null;

    this.categoriasSeleccionadas = this.categorias.map(
      categoria => usuario.categorias.some(c => c.id === categoria.id)
    );

    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.loading = true;
      this.error = null;
      this.usuarioForm.disable();

      this.http.delete(`http://localhost/cecati-login-backend/usuarios.php?id=${id}`)
        .subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.loading = false;
            this.usuarioForm.enable();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
              if (error && error.error && error.error.error) {
                this.error = error.error.error;
            } else {
                this.error = 'Error al eliminar el usuario. Inténtalo de nuevo.';
            }
            this.loading = false;
            this.usuarioForm.enable();
          }
        });
    }
  }

  cancelarEdicion() {
    this.usuarioForm.reset({
      rol: 'usuario',
    });
    this.editando = false;
    this.usuarioEditando = null;
    this.mostrarContrasena = false;
    this.error = null;
    this.categoriasSeleccionadas = this.categorias.map(() => false);
    this.usuarioForm.enable();

  }

  alternarVisibilidadContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}