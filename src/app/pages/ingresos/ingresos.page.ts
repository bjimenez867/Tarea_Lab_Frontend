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
  IonText,
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { IngresoService } from '../../services/ingreso';
import { VehiculoService } from '../../services/vehiculo';
import { EspacioParqueoService } from '../../services/espacio-parqueo';
import { Ingreso } from '../../models/ingreso.model';
import { Vehiculo } from '../../models/vehiculo.model';
import { EspacioParqueo } from '../../models/espacio-parqueo.model';

@Component({
  selector: 'app-ingresos',
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
    IonText,
  ],
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IngresosPage implements OnInit {
  ingresos: Ingreso[] = [];
  vehiculos: Vehiculo[] = [];
  espacios: EspacioParqueo[] = [];
  cargando = true;
  mostrarFormulario = false;
  ingresoForm: FormGroup;

  constructor(
    private ingresoService: IngresoService,
    private vehiculoService: VehiculoService,
    private espacioService: EspacioParqueoService,
    private fb: FormBuilder
  ) {
    this.ingresoForm = this.fb.group({
      vehiculoId: [null, [Validators.required]],
      espacioId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  get espaciosDisponibles(): EspacioParqueo[] {
    return this.espacios.filter((e) => e.disponible && e.activo);
  }

  cargarDatos() {
    this.cargando = true;
    this.vehiculoService.obtenerTodos().subscribe({ next: (data) => (this.vehiculos = data) });
    this.espacioService.obtenerTodos().subscribe({ next: (data) => (this.espacios = data) });
    this.ingresoService.obtenerTodos().subscribe({
      next: (data) => {
        this.ingresos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los ingresos', 'error');
      },
    });
  }

  placaVehiculo(vehiculoId: number): string {
    const vehiculo = this.vehiculos.find((v) => v.vehiculoId === vehiculoId);
    return vehiculo ? vehiculo.placa : '—';
  }

  numeroEspacio(espacioId: number): string {
    const espacio = this.espacios.find((e) => e.espacioId === espacioId);
    return espacio ? espacio.numeroEspacio : '—';
  }

  abrirNuevo() {
    this.ingresoForm.reset();
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.ingresoForm.invalid) {
      this.ingresoForm.markAllAsTouched();
      return;
    }

    this.ingresoService.crear(this.ingresoForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Ingreso registrado',
          timer: 1200,
          showConfirmButton: false,
        });
        this.mostrarFormulario = false;
        this.cargarDatos();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'Ocurrió un error al registrar el ingreso';
        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  async registrarSalida(ingreso: Ingreso) {
    const confirmacion = await Swal.fire({
      title: '¿Registrar salida?',
      text: `Vehículo ${this.placaVehiculo(ingreso.vehiculoId)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.ingresoService.registrarSalida(ingreso.ingresoId).subscribe({
        next: () => {
          Swal.fire('Salida registrada', 'El espacio quedó disponible', 'success');
          this.cargarDatos();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo registrar la salida';
          Swal.fire('Error', mensaje, 'error');
        },
      });
    }
  }

  async eliminar(ingreso: Ingreso) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar ingreso?',
      text: this.placaVehiculo(ingreso.vehiculoId),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.ingresoService.eliminar(ingreso.ingresoId).subscribe({
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
