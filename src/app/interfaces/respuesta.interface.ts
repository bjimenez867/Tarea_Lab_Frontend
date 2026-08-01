export interface Respuesta<T> {
  exito: boolean;
  mensaje?: string;
  datos: T;
}