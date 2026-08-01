import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dashboard } from '../models/dashboard.model';
import { Respuesta } from '../interfaces/respuesta.interface';
import { API_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${API_URL}/Dashboard`;

  constructor(private http: HttpClient) {}

  obtenerIndicadores(): Observable<Dashboard> {
    return this.http.get<Respuesta<Dashboard>>(this.baseUrl)
      .pipe(map(r => r.datos));
  }
}