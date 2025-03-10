import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost/cecati-login/frontend/php.api/controllers/usuarios.php'; // Ajusta la URL de tu API

  constructor(private http: HttpClient) { }

  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Agrega otros métodos si es necesario (crear, actualizar, eliminar)
}