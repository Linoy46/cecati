import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TablasComponent } from './pages/tablas/tablas.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { InformesComponent } from './pages/informes/informes.component';
import { SugerenciasComponent } from './pages/sugerencias/sugerencias.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './app/layouts/main-layout/main-layout.component';
import { AuthenticatedLayoutComponent } from './app/layouts/authenticated-layout/authenticated-layout.component';
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component';
import { CursosComponent } from './pages/cursos/cursos.component';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';
import { AdminLayoutComponent } from './app/layouts/admin-layout/admin-layout.component'; 

// Importa tus componentes de administrador aquí
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
import { AdminContenidoComponent } from './pages/admin/admin-contenido/admin-contenido.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    {
        path: '',
        component: MainLayoutComponent,  // Layout para rutas públicas
        children: [
            { path: 'inicio', component: InicioComponent },
            { path: 'organigrama', component: OrganigramaComponent },
            { path: 'informes', component: InformesComponent },
            { path: 'sugerencias', component: SugerenciasComponent },
            { path: 'tablas', component: TablasComponent },
        ]
    },

    {
        path: '',
        component: AuthenticatedLayoutComponent, // Layout para rutas autenticadas
        canActivate: [AuthGuard],             // Protege TODAS las rutas hijas
        children: [
            { path: 'calificaciones', component: CalificacionesComponent },
            { path: 'cursos', component: CursosComponent },
            { path: 'actividad', component: ActividadComponent },
        ]
    },

    // Rutas de administrador
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard], // Protege las rutas de administrador
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'usuarios', component: AdminUsuariosComponent },
            { path: 'contenido', component: AdminContenidoComponent }
            // ... más rutas de administrador
        ]
    },

    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'inicio' }
];