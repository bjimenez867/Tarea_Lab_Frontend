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
  IonText,
  IonToggle,
} from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { ParqueoService } from '../../services/parqueo';
import { Parqueo } from '../../models/parqueo.model';

@Component({
  selector: 'app-parqueos',
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
    IonText,
    IonToggle,
  ],
  templateUrl: './parqueos.page.html',
  styleUrls: ['./parqueos.page.scss'],
})
export class ParqueosPage implements OnInit {
  parqueos: Parqueo[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  parqueoForm: FormGroup;

  constructor(
    private parqueoService: ParqueoService,
    private fb: FormBuilder
  ) {
    this.parqueoForm = this.fb.group({
      parqueoId: [0],
      nombreParqueo: ['', [Validators.required, Validators.maxLength(150)]],
      direccion: ['', [Validators.required, Validators.maxLength(250)]],
      telefono: ['', [Validators.maxLength(25)]],
      capacidadTotal: [1, [Validators.required, Validators.min(1)]],
      activo: [true],
    });
  }

  ngOnInit() {
    this.cargarParqueos();
  }

  ionViewWillEnter() {
    this.cargarParqueos();
  }

  cargarParqueos() {
    this.cargando = true;
    this.parqueoService.obtenerTodos().subscribe({
      next: (data) => {
        this.parqueos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los parqueos', 'error');
      },
    });
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.parqueoForm.reset({ parqueoId: 0, capacidadTotal: 1, activo: true });
    this.mostrarFormulario = true;
  }

  abrirEditar(parqueo: Parqueo) {
    this.modoEdicion = true;
    this.parqueoForm.setValue({
      parqueoId: parqueo.parqueoId,
      nombreParqueo: parqueo.nombreParqueo,
      direccion: parqueo.direccion,
      telefono: parqueo.telefono ?? '',
      capacidadTotal: parqueo.capacidadTotal,
      activo: parqueo.activo,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.parqueoForm.invalid) {
      this.parqueoForm.markAllAsTouched();
      return;
    }

    const parqueo: Parqueo = this.parqueoForm.value;

    const operacion = this.modoEdicion
      ? this.parqueoService.actualizar(parqueo.parqueoId, parqueo)
      : this.parqueoService.crear(parqueo);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Parqueo actualizado' : 'Parqueo creado',
          timer: 1200,
          showConfirmButton: false,
        });
        this.mostrarFormulario = false;
        this.cargarParqueos();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'Ocurrió un error al guardar';
        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  async eliminar(parqueo: Parqueo) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar parqueo?',
      text: parqueo.nombreParqueo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.parqueoService.eliminar(parqueo.parqueoId).subscribe({
        next: () => {
          Swal.fire('Eliminado', '', 'success');
          this.cargarParqueos();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo eliminar';
          Swal.fire('Error', mensaje, 'error');
        },
      });
    }
  }
}
