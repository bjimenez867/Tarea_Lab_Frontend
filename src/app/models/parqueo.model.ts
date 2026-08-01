export interface Parqueo {
  parqueoId: number;
  nombreParqueo: string;
  direccion: string;
  telefono?: string;
  capacidadTotal: number;
  activo: boolean;
}