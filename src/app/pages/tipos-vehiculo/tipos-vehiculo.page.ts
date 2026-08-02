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
  IonInput,
  IonToggle,
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { TipoVehiculoService } from '../../services/tipo-vehiculo';
import { TipoVehiculo } from '../../models/tipo-vehiculo.model';

@Component({
  selector: 'app-tipos-vehiculo',
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
    IonInput,
    IonToggle,
  ],
  templateUrl: './tipos-vehiculo.page.html',
  styleUrls: ['./tipos-vehiculo.page.scss'],
})
export class TiposVehiculoPage implements OnInit {
  tipos: TipoVehiculo[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  tipoForm: FormGroup;

  constructor(
    private tipoVehiculoService: TipoVehiculoService,
    private fb: FormBuilder
  ) {
    this.tipoForm = this.fb.group({
      tipoVehiculoId: [0],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      activo: [true],
    });
  }

  ngOnInit() {
    this.cargarTipos();
  }

  ionViewWillEnter() {
    this.cargarTipos();
  }

  cargarTipos() {
    this.cargando = true;
    this.tipoVehiculoService.obtenerTodos().subscribe({
      next: (data) => {
        this.tipos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los tipos de vehículo', 'error');
      },
    });
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.tipoForm.reset({ tipoVehiculoId: 0, activo: true });
    this.mostrarFormulario = true;
  }

  abrirEditar(tipo: TipoVehiculo) {
    this.modoEdicion = true;
    this.tipoForm.setValue({
      tipoVehiculoId: tipo.tipoVehiculoId,
      descripcion: tipo.descripcion,
      activo: tipo.activo,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.tipoForm.invalid) {
      this.tipoForm.markAllAsTouched();
      return;
    }

    const tipo: TipoVehiculo = this.tipoForm.value;

    const operacion = this.modoEdicion
      ? this.tipoVehiculoService.actualizar(tipo.tipoVehiculoId, tipo)
      : this.tipoVehiculoService.crear(tipo);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Tipo actualizado' : 'Tipo creado',
          timer: 1200,
          showConfirmButton: false,
        });
        this.mostrarFormulario = false;
        this.cargarTipos();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'Ocurrió un error al guardar';
        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  async eliminar(tipo: TipoVehiculo) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar tipo de vehículo?',
      text: tipo.descripcion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.tipoVehiculoService.eliminar(tipo.tipoVehiculoId).subscribe({
        next: () => {
          Swal.fire('Eliminado', '', 'success');
          this.cargarTipos();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo eliminar';
          Swal.fire('Error', mensaje, 'error');
        },
      });
    }
  }
}
