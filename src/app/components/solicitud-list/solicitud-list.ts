import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoSolicitud, Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { BusquedaSolicitudes } from '../busqueda-solicitudes/busqueda-solicitudes';

type FiltroEstado = 'Todos' | EstadoSolicitud;

@Component({
  selector: 'app-solicitud-list',
  imports: [RouterLink, BusquedaSolicitudes],
  templateUrl: './solicitud-list.html',
  styleUrl: './solicitud-list.css',
})
export class SolicitudList {
  private readonly servicio = inject(SolicitudService);

  /** Llega desde ?estado=... gracias a withComponentInputBinding(). */
  readonly estado = input<string>();

  readonly solicitudes = this.servicio.solicitudes;
  readonly total = this.servicio.total;
  readonly pendientes = this.servicio.pendientes;
  readonly estados: FiltroEstado[] = ['Todos', 'Pendiente', 'En proceso', 'Resuelto'];
  readonly estadosSolicitud: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelto'];

  readonly filtroActual = computed(() => this.estado() ?? 'Todos');

  readonly visibles = computed(() => {
    const filtro = this.filtroActual();
    const solicitudes = this.servicio.solicitudes();

    return filtro === 'Todos'
      ? solicitudes
      : solicitudes.filter((solicitud) => solicitud.estado === filtro);
  });

  readonly conteos = computed(() => {
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

  cambiarEstado(id: number, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoSolicitud;
    this.servicio.cambiarEstado(id, estado);
  }

  eliminar(id: number): void {
    this.servicio.eliminar(id);
  }

  contar(estado: FiltroEstado): number {
    return estado === 'Todos' ? this.total() : this.conteos()[estado];
  }

  /** Sin estado se navega a la misma ruta sin parámetros de consulta. */
  queryParams(estado: FiltroEstado): Record<string, string> {
    return estado === 'Todos' ? {} : { estado };
  }

  formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  claseEstado(estado: EstadoSolicitud): string {
    if (estado === 'Pendiente') {
      return 'estado-pendiente';
    }

    if (estado === 'En proceso') {
      return 'estado-proceso';
    }

    return 'estado-resuelto';
  }

  clasePrioridad(solicitud: Solicitud): string {
    return `prioridad-${solicitud.prioridad.toLowerCase().replace('í', 'i')}`;
  }
}
