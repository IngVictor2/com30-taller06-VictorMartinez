import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SolicitudService } from './services/solicitud.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly servicio = inject(SolicitudService);

  readonly total = this.servicio.total;
  readonly pendientes = this.servicio.pendientes;
}
