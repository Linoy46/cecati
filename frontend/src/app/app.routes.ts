import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TablasComponent } from './pages/tablas/tablas.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'tablas', component: TablasComponent, canActivate: [AuthGuard] }, // Corrección aquí
  { path: '**', redirectTo: '' }

];
