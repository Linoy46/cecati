import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { InformesComponent } from './pages/informes/informes.component';
import { SugerenciasComponent } from './pages/sugerencias/sugerencias.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './app/layouts/main-layout/main-layout.component';
import { AuthenticatedLayoutComponent } from './app/layouts/authenticated-layout/authenticated-layout.component';
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component';
import { ActividadComponent } from './pages/actividad/actividad.component';
import { OrganigramaComponent } from './pages/organigrama/organigrama.component';
import { AdminLayoutComponent } from './app/layouts/admin-layout/admin-layout.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
//import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
//import { AdminContenidoComponent } from './pages/admin/admin-contenido/admin-contenido.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'inicio', component: InicioComponent },
            { path: 'organigrama', component: OrganigramaComponent },
            { path: 'informes', component: InformesComponent },
            { path: 'sugerencias', component: SugerenciasComponent },
    //        { path: 'tablas', component: TablasComponent },
        ]
    },
    {
        path: '',
        component: AuthenticatedLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'user/calificaciones', component: CalificacionesComponent },
            { path: 'actividad', component: ActividadComponent },
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: 'adm' },
        children: [
          { path: 'usuarios', component: UsuariosComponent }
        ]
    },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'inicio' }
];
