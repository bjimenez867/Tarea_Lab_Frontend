import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EspacioParqueo } from '../models/espacio-parqueo.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class EspacioParqueoService {
  private readonly baseUrl = `${API_URL}/EspacioParqueo`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<EspacioParqueo[]> {
    return this.http.get<Respuesta<EspacioParqueo[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<EspacioParqueo> {
    return this.http.get<Respuesta<EspacioParqueo>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(espacio: EspacioParqueo): Observable<Respuesta<EspacioParqueo>> {
    return this.http.post<Respuesta<EspacioParqueo>>(this.baseUrl, espacio);
  }

  actualizar(id: number, espacio: EspacioParqueo): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, espacio);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}