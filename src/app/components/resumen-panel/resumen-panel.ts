import { Component, computed, inject } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-resumen-panel',
  templateUrl: './resumen-panel.html',
  styleUrl: './resumen-panel.css',
})
export class ResumenPanel {
  private readonly servicio = inject(SolicitudService);

  readonly total = this.servicio.total;
  readonly pendientes = this.servicio.pendientes;

  readonly enProceso = computed(
    () => this.servicio.solicitudes().filter((solicitud) => solicitud.estado === 'En proceso').length,
  );

  readonly resueltos = computed(
    () => this.servicio.solicitudes().filter((solicitud) => solicitud.estado === 'Resuelto').length,
  );

  readonly criticas = computed(
    () => this.servicio.solicitudes().filter((solicitud) => solicitud.prioridad === 'Crítica').length,
  );

  readonly avance = computed(() => {
    const total = this.total();
    return total === 0 ? 0 : Math.round((this.resueltos() / total) * 100);
  });
}
