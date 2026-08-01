import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tarifa } from '../models/tarifa.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private readonly baseUrl = `${API_URL}/Tarifa`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Tarifa[]> {
    return this.http.get<Respuesta<Tarifa[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Tarifa> {
    return this.http.get<Respuesta<Tarifa>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(tarifa: Tarifa): Observable<Respuesta<Tarifa>> {
    return this.http.post<Respuesta<Tarifa>>(this.baseUrl, tarifa);
  }

  actualizar(id: number, tarifa: Tarifa): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, tarifa);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}