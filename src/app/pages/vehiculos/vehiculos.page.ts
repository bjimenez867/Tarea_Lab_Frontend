import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonToggle,
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { VehiculoService } from '../../services/vehiculo';
import { ClienteService } from '../../services/cliente';
import { TipoVehiculoService } from '../../services/tipo-vehiculo';
import { Vehiculo } from '../../models/vehiculo.model';
import { Cliente } from '../../models/cliente.model';
import { TipoVehiculo } from '../../models/tipo-vehiculo.model';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonToggle,
  ],
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
})
export class VehiculosPage implements OnInit {
  vehiculos: Vehiculo[] = [];
  clientes: Cliente[] = [];
  tiposVehiculo: TipoVehiculo[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  vehiculoForm: FormGroup;

  constructor(
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private tipoVehiculoService: TipoVehiculoService,
    private fb: FormBuilder
  ) {
    this.vehiculoForm = this.fb.group({
      vehiculoId: [0],
      clienteId: [null, [Validators.required]],
      tipoVehiculoId: [null, [Validators.required]],
      placa: ['', [Validators.required, Validators.maxLength(20)]],
      marca: ['', [Validators.required, Validators.maxLength(100)]],
      modelo: ['', [Validators.maxLength(100)]],
      color: ['', [Validators.maxLength(50)]],
      activo: [true],
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.clienteService.obtenerTodos().subscribe({ next: (data) => (this.clientes = data) });
    this.tipoVehiculoService.obtenerTodos().subscribe({ next: (data) => (this.tiposVehiculo = data) });
    this.vehiculoService.obtenerTodos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los vehículos', 'error');
      },
    });
  }

  nombreCliente(clienteId: number): string {
    const cliente = this.clientes.find((c) => c.clienteId === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellidos}` : '—';
  }

  nombreTipoVehiculo(tipoVehiculoId: number): string {
    const tipo = this.tiposVehiculo.find((t) => t.tipoVehiculoId === tipoVehiculoId);
    return tipo ? tipo.descripcion : '—';
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.vehiculoForm.reset({ vehiculoId: 0, activo: true });
    this.mostrarFormulario = true;
  }

  abrirEditar(vehiculo: Vehiculo) {
    this.modoEdicion = true;
    this.vehiculoForm.setValue({
      vehiculoId: vehiculo.vehiculoId,
      clienteId: vehiculo.clienteId,
      tipoVehiculoId: vehiculo.tipoVehiculoId,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo ?? '',
      color: vehiculo.color ?? '',
      activo: vehiculo.activo,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const vehiculo: Vehiculo = this.vehiculoForm.value;

    const operacion = this.modoEdicion
      ? this.vehiculoService.actualizar(vehiculo.vehiculoId, vehiculo)
      : this.vehiculoService.crear(vehiculo);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Vehículo actualizado' : 'Vehículo creado',
          timer: 1200,
          showConfirmButton: false,
        });
        this.mostrarFormulario = false;
        this.cargarDatos();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'Ocurrió un error al guardar';
        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  async eliminar(vehiculo: Vehiculo) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar vehículo?',
      text: vehiculo.placa,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.vehiculoService.eliminar(vehiculo.vehiculoId).subscribe({
        next: () => {
          Swal.fire('Eliminado', '', 'success');
          this.cargarDatos();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo eliminar';
          Swal.fire('Error', mensaje, 'error');
        },
      });
    }
  }
}
