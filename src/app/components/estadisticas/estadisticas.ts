import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria, EstadoSolicitud, Prioridad } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { ResumenPanel } from '../resumen-panel/resumen-panel';

@Component({
  selector: 'app-estadisticas',
  imports: [RouterLink, ResumenPanel],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas {
  private readonly servicio = inject(SolicitudService);

  readonly total = this.servicio.total;
  readonly categorias: Categoria[] = ['Hardware', 'Software', 'Red', 'Acceso', 'Otro'];
  readonly prioridades: Prioridad[] = ['Baja', 'Media', 'Alta', 'Crítica'];
  readonly estados: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelto'];

  readonly porCategoria = computed(() => {
    const conteo: Record<Categoria, number> = {
      Hardware: 0,
      Software: 0,
      Red: 0,
      Acceso: 0,
      Otro: 0,
    };

    for (const solicitud of this.servicio.solicitudes()) {
      conteo[solicitud.categoria]++;
    }

    return conteo;
  });

  readonly porPrioridad = computed(() => {
    const conteo: Record<Prioridad, number> = {
      Baja: 0,
      Media: 0,
      Alta: 0,
      Crítica: 0,
    };

    for (const solicitud of this.servicio.solicitudes()) {
      conteo[solicitud.prioridad]++;
    }

    return conteo;
  });

  readonly porEstado = computed(() => {
    const conteo: Record<EstadoSolicitud, number> = {
      Pendiente: 0,
      'En proceso': 0,
      Resuelto: 0,
    };

    for (const solicitud of this.servicio.solicitudes()) {
      conteo[solicitud.estado]++;
    }

    return conteo;
  });
}
