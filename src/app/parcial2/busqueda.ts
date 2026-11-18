import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { SolicitudService } from '../services/solicitud.service';

@Component({
  selector: 'app-parcial-busqueda',
  imports: [ReactiveFormsModule],
  template: `
    <section class="tarjeta">
      <h2>Buscar solicitudes</h2>
      <div class="campo">
        <label for="buscar">Buscar</label>
        <input id="buscar" [formControl]="buscar">
      </div>
      <p>Último valor: {{ ultimo() }}</p>
      <p>Emisiones: {{ emisiones() }}</p>
      <ul>
        @for (fila of filtradas(); track fila.id) {
          <li>{{ fila.codigo }} · {{ fila.solicitante }} · {{ fila.impacto }}</li>
        } @empty { <li>Sin resultados</li> }
      </ul>
    </section>
  `,
})
export class BusquedaParcial {
  private readonly servicio = inject(SolicitudService);
  readonly buscar = new FormControl('', { nonNullable: true });
  readonly ultimo = signal('');
  readonly emisiones = signal(0);
  readonly filtradas = computed(() => {
    const texto = this.ultimo().toLowerCase();
    return this.servicio.solicitudes().filter(fila =>
      [fila.codigo, fila.solicitante, fila.impacto].some(valor => valor.toLowerCase().includes(texto))
    );
  });

  constructor() {
    this.buscar.valueChanges.pipe(
      map(valor => valor.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(valor => {
      this.ultimo.set(valor);
      this.emisiones.update(total => total + 1);
    });
  }
}
