import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoVehiculo } from '../models/tipo-vehiculo.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {
  private readonly baseUrl = `${API_URL}/TipoVehiculo`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<TipoVehiculo[]> {
    return this.http.get<Respuesta<TipoVehiculo[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<TipoVehiculo> {
    return this.http.get<Respuesta<TipoVehiculo>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(tipo: TipoVehiculo): Observable<Respuesta<TipoVehiculo>> {
    return this.http.post<Respuesta<TipoVehiculo>>(this.baseUrl, tipo);
  }

  actualizar(id: number, tipo: TipoVehiculo): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, tipo);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}