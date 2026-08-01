import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingreso } from '../models/ingreso.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private readonly baseUrl = `${API_URL}/IngresoVehiculo`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Ingreso[]> {
    return this.http.get<Respuesta<Ingreso[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Ingreso> {
    return this.http.get<Respuesta<Ingreso>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(ingreso: Ingreso): Observable<Respuesta<Ingreso>> {
    return this.http.post<Respuesta<Ingreso>>(this.baseUrl, ingreso);
  }

  actualizar(id: number, ingreso: Ingreso): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, ingreso);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }

  registrarSalida(id: number): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}/salida`, {});
  }
}