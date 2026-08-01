import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehiculo } from '../models/vehiculo.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly baseUrl = `${API_URL}/Vehiculo`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Vehiculo[]> {
    return this.http.get<Respuesta<Vehiculo[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Vehiculo> {
    return this.http.get<Respuesta<Vehiculo>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(vehiculo: Vehiculo): Observable<Respuesta<Vehiculo>> {
    return this.http.post<Respuesta<Vehiculo>>(this.baseUrl, vehiculo);
  }

  actualizar(id: number, vehiculo: Vehiculo): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, vehiculo);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}