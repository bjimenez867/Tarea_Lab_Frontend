import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parqueo } from '../models/parqueo.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ParqueoService {
  private readonly baseUrl = `${API_URL}/Parqueo`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Parqueo[]> {
    return this.http.get<Respuesta<Parqueo[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Parqueo> {
    return this.http.get<Respuesta<Parqueo>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(parqueo: Parqueo): Observable<Respuesta<Parqueo>> {
    return this.http.post<Respuesta<Parqueo>>(this.baseUrl, parqueo);
  }

  actualizar(id: number, parqueo: Parqueo): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, parqueo);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}