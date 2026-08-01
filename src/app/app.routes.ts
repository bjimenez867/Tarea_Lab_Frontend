import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then( m => m.ClientesPage)
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./pages/vehiculos/vehiculos.page').then( m => m.VehiculosPage)
  },
  {
    path: 'parqueos',
    loadComponent: () => import('./pages/parqueos/parqueos.page').then( m => m.ParqueosPage)
  },
  {
    path: 'ingresos',
    loadComponent: () => import('./pages/ingresos/ingresos.page').then( m => m.IngresosPage)
  },
  {
    path: 'facturas',
    loadComponent: () => import('./pages/facturas/facturas.page').then( m => m.FacturasPage)
  },
  {
    path: 'espacios',
    loadComponent: () => import('./pages/espacios/espacios.page').then( m => m.EspaciosPage)
  },
  {
    path: 'tipos-vehiculo',
    loadComponent: () => import('./pages/tipos-vehiculo/tipos-vehiculo.page').then( m => m.TiposVehiculoPage)
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];