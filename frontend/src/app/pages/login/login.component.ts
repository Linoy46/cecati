import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [ReactiveFormsModule], 
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
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { correo, contrasena } = this.loginForm.value;
    console.log('Enviando datos:', { correo, contrasena });

    this.authService.login(correo, contrasena).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        if (response.mensaje === 'Login exitoso') {
          this.errorMessage = '';

          // Redirigir según el rol
          if (response.rol === 'adm') {
            this.router.navigate(['/admin/dashboard']); // Redirigir a la interfaz de administrador
          } else {
            this.router.navigate(['/cursos']); // Redirigir a la interfaz de usuario normal
          }
        } else {
          this.errorMessage = response.error || 'Error desconocido al iniciar sesión';
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}