export interface Ingreso {
  ingresoId: number;
  vehiculoId: number;
  espacioId: number;
  fechaIngreso: string;
  fechaSalida?: string;
  estado: string;
}