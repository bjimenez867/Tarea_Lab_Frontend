export interface Cliente {
  clienteId: number;
  nombre: string;
  apellidos: string;
  cedula: string;
  telefono?: string;
  correo?: string;
  activo: boolean;
}