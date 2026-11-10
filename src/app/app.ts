import { Component, inject } from '@angular/core';
import { BusquedaSolicitudes } from './components/busqueda-solicitudes/busqueda-solicitudes';
import { SolicitudForm } from './components/solicitud-form/solicitud-form';
import { SolicitudList } from './components/solicitud-list/solicitud-list';
import { SolicitudService } from './services/solicitud.service';

@Component({
  selector: 'app-root',
  imports: [BusquedaSolicitudes, SolicitudForm, SolicitudList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly servicio = inject(SolicitudService);

  readonly total = this.servicio.total;
  readonly pendientes = this.servicio.pendientes;
}
