import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  // Credenciales fijas 
  private readonly USUARIO_VALIDO = 'admin';
  private readonly PASSWORD_VALIDA = 'admin';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  async iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { usuario, password } = this.loginForm.value;

    if (usuario === this.USUARIO_VALIDO && password === this.PASSWORD_VALIDA) {
      await Preferences.set({ key: 'sesionActiva', value: 'true' });
      await Preferences.set({ key: 'usuario', value: usuario });

      await Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión exitoso',
        timer: 1200,
        showConfirmButton: false,
      });

      this.router.navigate(['/dashboard']);
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
      });
    }
  }
}