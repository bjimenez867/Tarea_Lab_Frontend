import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard';
import { Dashboard } from '../../models/dashboard.model';
import { MonedaPipe } from '../../pipes/moneda-pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule, MonedaPipe],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild('facturacionChart') facturacionChartRef?: ElementRef<HTMLCanvasElement>;

  indicadores: Dashboard | null = null;
  cargando = true;
  private grafico?: Chart;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarIndicadores();
  }

  ionViewWillEnter() {
    this.cargarIndicadores();
  }

  ngOnDestroy() {
    this.grafico?.destroy();
  }

  cargarIndicadores() {
    this.cargando = true;
    this.dashboardService.obtenerIndicadores().subscribe({
      next: (data) => {
        this.indicadores = data;
        this.cargando = false;
        setTimeout(() => this.dibujarGrafico());
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.cargando = false;
      },
    });
  }

  private dibujarGrafico() {
    if (!this.indicadores || !this.facturacionChartRef) return;

    this.grafico?.destroy();

    this.grafico = new Chart(this.facturacionChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Facturación diaria', 'Facturación mensual'],
        datasets: [
          {
            label: 'Monto (₡)',
            data: [this.indicadores.facturacionDiaria, this.indicadores.facturacionMensual],
            backgroundColor: ['#6030ff', '#2dd36f'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  irA(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  async cerrarSesion() {
    await Preferences.clear();
    this.router.navigate(['/login']);
  }
}