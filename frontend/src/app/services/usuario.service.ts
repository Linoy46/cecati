import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost/cecati-login/frontend/php.api/controllers/usuarios.php';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
}