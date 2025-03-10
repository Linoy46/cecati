import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { correo, contrasena } = this.loginForm.value;

    this.authService.login(correo, contrasena).subscribe({
      next: (response: AuthResponse) => {
        if (response.sesion_activa === true) {
          this.errorMessage = '';
          this.authService.setCurrentUser(response);

          if (response.rol === 'adm') {
            this.router.navigate(['/admin/usuarios']);
          } else {
            this.router.navigate(['/user/calificaciones']);
          }
        } else {
          this.errorMessage = response.error || 'Error desconocido al iniciar sesión';
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Correo o contraseña incorrectos';
        if (error.status === 0) {
          this.errorMessage = "No se pudo conectar con el servidor.";
        } else if (error.status === 401) {
          this.errorMessage = "Credenciales inválidas.";
        } else if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        }
      }
    });
  }
}
