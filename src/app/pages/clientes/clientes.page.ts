import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  clientes: Cliente[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;
  clienteForm: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      clienteId: [0],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(150)]],
      cedula: ['', [Validators.required, Validators.maxLength(25)]],
      telefono: ['', [Validators.maxLength(25)]],
      correo: ['', [Validators.email]],
      activo: [true],
    });
  }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clienteService.obtenerTodos().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
      },
    });
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.clienteForm.reset({ clienteId: 0, activo: true });
    this.mostrarFormulario = true;
  }

  abrirEditar(cliente: Cliente) {
    this.modoEdicion = true;
    this.clienteForm.setValue({
      clienteId: cliente.clienteId,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      cedula: cliente.cedula,
      telefono: cliente.telefono ?? '',
      correo: cliente.correo ?? '',
      activo: cliente.activo,
    });
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const cliente: Cliente = this.clienteForm.value;

    const operacion = this.modoEdicion
      ? this.clienteService.actualizar(cliente.clienteId, cliente)
      : this.clienteService.crear(cliente);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Cliente actualizado' : 'Cliente creado',
          timer: 1200,
          showConfirmButton: false,
        });
        this.mostrarFormulario = false;
        this.cargarClientes();
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje ?? 'Ocurrió un error al guardar';
        Swal.fire('Error', mensaje, 'error');
      },
    });
  }

  async eliminar(cliente: Cliente) {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `${cliente.nombre} ${cliente.apellidos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmacion.isConfirmed) {
      this.clienteService.eliminar(cliente.clienteId).subscribe({
        next: () => {
          Swal.fire('Eliminado', '', 'success');
          this.cargarClientes();
        },
        error: (err) => {
          const mensaje = err?.error?.mensaje ?? 'No se pudo eliminar';
          Swal.fire('Error', mensaje, 'error');
        },
      });
    }
  }
}