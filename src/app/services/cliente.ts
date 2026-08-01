import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly baseUrl = `${API_URL}/Cliente`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Cliente[]> {
    return this.http.get<Respuesta<Cliente[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Cliente> {
    return this.http.get<Respuesta<Cliente>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(cliente: Cliente): Observable<Respuesta<Cliente>> {
    return this.http.post<Respuesta<Cliente>>(this.baseUrl, cliente);
  }

  actualizar(id: number, cliente: Cliente): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, cliente);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}