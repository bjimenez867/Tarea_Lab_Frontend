import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Factura } from '../models/factura.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private readonly baseUrl = `${API_URL}/Factura`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Factura[]> {
    return this.http.get<Respuesta<Factura[]>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }

  obtenerPorId(id: number): Observable<Factura> {
    return this.http.get<Respuesta<Factura>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.datos));
  }

  crear(factura: Factura): Observable<Respuesta<Factura>> {
    return this.http.post<Respuesta<Factura>>(this.baseUrl, factura);
  }

  actualizar(id: number, factura: Factura): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(`${this.baseUrl}/${id}`, factura);
  }

  eliminar(id: number): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.baseUrl}/${id}`);
  }
}