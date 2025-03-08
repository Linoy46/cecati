import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../services/auth.service'; // Import AuthResponse
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule if using *ngIf
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
        //  mark all fields as touched to display validation messages
        Object.values(this.loginForm.controls).forEach(control => {
            control.markAsTouched();
        });
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { correo, contrasena } = this.loginForm.value;

    this.authService.login(correo, contrasena).subscribe({
      next: (response: AuthResponse) => { // Use the AuthResponse type
        // console.log('Respuesta del backend:', response); //  for debugging

        if (response.sesion_activa === true) { //  check for sesion_activa
          this.errorMessage = '';

          // Store user info.  VERY IMPORTANT!
          this.authService.setCurrentUser(response);

          // Redirect based on role
          if (response.rol === 'adm') {
            this.router.navigate(['/admin/dashboard']); // Redirect to admin
          } else {
            this.router.navigate(['/user/calificaciones']); // Redirect to user
          }
        } else {
          // Handle login failure (show message from server, if available)
          this.errorMessage = response.error || 'Error desconocido al iniciar sesión';
        }
      },
      error: (error) => {  // Improved error handling
        console.error('Error en el login:', error);
        this.errorMessage = 'Correo o contraseña incorrectos'; // Default error
        if (error.status === 0) {
            this.errorMessage = "No se pudo conectar con el servidor."; // No connection
        } else if (error.status === 401) {
          this.errorMessage = "Credenciales inválidas."; // Unauthorized
        } else if (error.error && error.error.error) {
            this.errorMessage = error.error.error; //  custom error message
        }
      }
    });
  }
}