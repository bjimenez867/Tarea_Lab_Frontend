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
  IonNote,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonText,
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { FacturaService } from '../../services/factura';
import { IngresoService } from '../../services/ingreso';
import { VehiculoService } from '../../services/vehiculo';
import { Factura } from '../../models/factura.model';
import { Ingreso } from '../../models/ingreso.model';
import { Vehiculo } from '../../models/vehiculo.model';
import { MonedaPipe } from '../../pipes/moneda-pipe';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MonedaPipe,
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
    IonNote,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonText,
  ],
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  facturas: Factura[] = [];
  ingresos: Ingreso[] = [];
  vehiculos: Vehiculo[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  facturaForm: FormGroup;

  constructor(
    private facturaService: FacturaService,
    private ingresoService: IngresoService,
    private vehiculoService: VehiculoService,
    private fb: FormBuilder
  ) {
    this.facturaForm = this.fb.group({
      facturaId: [0],
      ingresoId: [null, [Validators.required]],
      horasCobradas: [0, [Validators.required, Validators.min(0)]],
      montoTotal: [0, [Validators.required, Validators.min(0)]],
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
    this.vehiculoService.obtenerTodos().subscribe({ next: (data) => (this.vehiculos = data) });
    this.ingresoService.obtenerTodos().subscribe({ next: (data) => (this.ingresos = data) });
    this.facturaService.obtenerTodos().subscribe({
      next: (data) => {
        this.facturas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las facturas', 'error');
      },
    });
  }

  descripcionIngreso(ingresoId: number): string {
    const ingreso = this.ingresos.find((i) => i.ingresoId === ingresoId);
    if (!ingreso) return '—';
    const vehiculo = this.vehiculos.find((v) => v.vehiculoId === ingreso.vehiculoId);
    return vehiculo ? `#${ingreso.ingresoId} · ${vehiculo.placa}` : `#${ingreso.ingresoId}`;
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.facturaForm.reset({ facturaId: 0, horasCobradas: 0, montoTotal: 0 });
    this.mostrarFormulario = true;
  }

  abrirEditar(factura: Factura) {
    this.modoEdicion = true;
    this.facturaForm.setValue({
      facturaId: factura.facturaId,
      ingresoId: factura.ingresoId,
      horasCobradas: factura.horasCobradas,
      montoTotal: factura.montoTotal,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    const factura: Factura = this.facturaForm.value;

    const operacion = this.modoEdicion
      ? this.facturaService.actualizar(factura.facturaId, factura)
      : this.facturaService.crear(factura);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Factura actualizada' : 'Factura creada',
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

  async eliminar(factura: Factura) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar factura?',
      text: `Factura #${factura.facturaId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.facturaService.eliminar(factura.facturaId).subscribe({
        next: () => {
          Swal.fire('Eliminada', '', 'success');
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
