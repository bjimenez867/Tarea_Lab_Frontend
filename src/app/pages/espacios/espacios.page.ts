import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import Swal from 'sweetalert2';
import { EspacioParqueoService } from '../../services/espacio-parqueo';
import { ParqueoService } from '../../services/parqueo';
import { EspacioParqueo } from '../../models/espacio-parqueo.model';
import { Parqueo } from '../../models/parqueo.model';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './espacios.page.html',
  styleUrls: ['./espacios.page.scss'],
})
export class EspaciosPage implements OnInit {
  espacios: EspacioParqueo[] = [];
  parqueos: Parqueo[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  espacioForm: FormGroup;

  constructor(
    private espacioService: EspacioParqueoService,
    private parqueoService: ParqueoService,
    private fb: FormBuilder
  ) {
    this.espacioForm = this.fb.group({
      espacioId: [0],
      parqueoId: [null, [Validators.required]],
      numeroEspacio: ['', [Validators.required, Validators.maxLength(20)]],
      disponible: [true],
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
    this.parqueoService.obtenerTodos().subscribe({ next: (data) => (this.parqueos = data) });
    this.espacioService.obtenerTodos().subscribe({
      next: (data) => {
        this.espacios = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los espacios', 'error');
      },
    });
  }

  nombreParqueo(parqueoId: number): string {
    const parqueo = this.parqueos.find((p) => p.parqueoId === parqueoId);
    return parqueo ? parqueo.nombreParqueo : '—';
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.espacioForm.reset({ espacioId: 0, disponible: true, activo: true });
    this.mostrarFormulario = true;
  }

  abrirEditar(espacio: EspacioParqueo) {
    this.modoEdicion = true;
    this.espacioForm.setValue({
      espacioId: espacio.espacioId,
      parqueoId: espacio.parqueoId,
      numeroEspacio: espacio.numeroEspacio,
      disponible: espacio.disponible,
      activo: espacio.activo,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.espacioForm.invalid) {
      this.espacioForm.markAllAsTouched();
      return;
    }

    const espacio: EspacioParqueo = this.espacioForm.value;

    const operacion = this.modoEdicion
      ? this.espacioService.actualizar(espacio.espacioId, espacio)
      : this.espacioService.crear(espacio);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Espacio actualizado' : 'Espacio creado',
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

  async eliminar(espacio: EspacioParqueo) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar espacio?',
      text: `${this.nombreParqueo(espacio.parqueoId)} · ${espacio.numeroEspacio}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.espacioService.eliminar(espacio.espacioId).subscribe({
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
