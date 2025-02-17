import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],  // Asegurar que es un email válido
      contrasena: ['', Validators.required] 
    });
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
        this.authService.guardarToken(response.token);
        this.router.navigate(['/tablas']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}
