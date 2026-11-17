import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EstadoSolicitud, Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-solicitud-detalle',
  imports: [RouterLink],
  templateUrl: './solicitud-detalle.html',
  styleUrl: './solicitud-detalle.css',
})
export class SolicitudDetalle {
  private readonly servicio = inject(SolicitudService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly estados: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelto'];

  readonly solicitud = computed(() =>
    this.servicio.solicitudes().find((registro) => registro.codigo === this.id()),
  );

  cambiarEstado(evento: Event): void {
    const actual = this.solicitud();

    if (!actual) {
      return;
    }

    const estado = (evento.target as HTMLSelectElement).value as EstadoSolicitud;
    this.servicio.cambiarEstado(actual.id, estado);
  }

  eliminar(): void {
    const actual = this.solicitud();

    if (!actual) {
      return;
    }

    this.servicio.eliminar(actual.id);
    void this.router.navigate(['/solicitudes']);
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
