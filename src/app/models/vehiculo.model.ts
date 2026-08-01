export interface Vehiculo {
  vehiculoId: number;
  clienteId: number;
  tipoVehiculoId: number;
  placa: string;
  marca: string;
  modelo?: string;
  color?: string;
  activo: boolean;
}