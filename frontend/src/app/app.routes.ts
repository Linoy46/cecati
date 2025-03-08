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
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component'; //  user component
import { CursosComponent } from './pages/cursos/cursos.component';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';
import { AdminLayoutComponent } from './app/layouts/admin-layout/admin-layout.component';

import { AdminCalificacionesComponent } from './pages/admin/admin-calificaciones/admin-calificaciones.component';
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
        canActivate: [AuthGuard],                // Protege TODAS las rutas hijas
        children: [
            { path: 'user/calificaciones', component: CalificacionesComponent },  //  user route
            { path: 'cursos', component: CursosComponent },
            { path: 'actividad', component: ActividadComponent },
        ]
    },

    // Rutas de administrador
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard], // Protect admin routes
        data: { expectedRole: 'adm' }, //  expected role
        children: [
            { path: 'dashboard', component: AdminCalificacionesComponent }, //  admin route
            { path: 'usuarios', component: AdminUsuariosComponent },        //  admin route
            { path: 'contenido', component: AdminContenidoComponent }         //  admin route
            // ... más rutas de administrador
        ]
    },

    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'inicio' } // Wildcard route for a 404 page, redirects to home
];