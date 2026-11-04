import { Component, inject } from '@angular/core';
import { EstadoSolicitud, Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { ResumenPanel } from '../resumen-panel/resumen-panel';

@Component({
  selector: 'app-solicitud-list',
  imports: [ResumenPanel],
  templateUrl: './solicitud-list.html',
  styleUrl: './solicitud-list.css',
})
export class SolicitudList {
  private readonly servicio = inject(SolicitudService);

  readonly solicitudes = this.servicio.solicitudes;
  readonly total = this.servicio.total;
  readonly pendientes = this.servicio.pendientes;
  readonly estados: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelto'];

  cambiarEstado(id: number, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoSolicitud;
    this.servicio.cambiarEstado(id, estado);
  }

  eliminar(id: number): void {
    this.servicio.eliminar(id);
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
