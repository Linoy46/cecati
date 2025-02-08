import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LoginComponent } from './app/pages/login/login.component';

bootstrapApplication(LoginComponent, {
  providers: [provideRouter(routes)],
});