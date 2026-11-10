import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { EstadoSolicitud, Solicitud } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';

type FiltroEstado = 'Todos' | EstadoSolicitud;

@Component({
  selector: 'app-busqueda-solicitudes',
  imports: [ReactiveFormsModule],
  templateUrl: './busqueda-solicitudes.html',
  styleUrl: './busqueda-solicitudes.css',
})
export class BusquedaSolicitudes {
  private readonly servicio = inject(SolicitudService);
  private readonly destroyRef = inject(DestroyRef);

  readonly busqueda = new FormControl('', { nonNullable: true });
  readonly estados: FiltroEstado[] = ['Todos', 'Pendiente', 'En proceso', 'Resuelto'];
  readonly filtro = signal<FiltroEstado>('Todos');
  readonly historial = signal<string[]>([]);
  readonly buscando = signal(false);
  readonly haBuscado = signal(false);

  /** Texto recortado visible; se actualiza al instante para los mensajes. */
  readonly texto = toSignal(
    this.busqueda.valueChanges.pipe(map((valor) => valor.trim())),
    { initialValue: '' },
  );

  /**
   * Tubería común: map(trim) -> debounceTime(300) -> distinctUntilChanged.
   * Se comparte para que el historial y el resultado no dupliquen la consulta.
   */
  private readonly consultas$ = this.busqueda.valueChanges.pipe(
    map((valor) => valor.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** Resultado de la última consulta, expuesto como signal con valor inicial. */
  readonly registros = toSignal(
    this.consultas$.pipe(switchMap((texto) => this.consultar(texto))),
    { initialValue: [] as Solicitud[] },
  );

  /** Filtro local por estado: no dispara consultas al servicio. */
  readonly visibles = computed(() => {
    const filtro = this.filtro();
    const registros = this.registros();
    return filtro === 'Todos' ? registros : registros.filter((solicitud) => solicitud.estado === filtro);
  });

  readonly totalEncontrados = computed(() => this.registros().length);
  readonly totalVisibles = computed(() => this.visibles().length);

  /** Conteo por estado de los registros encontrados. */
  readonly conteoEstados = computed(() => {
    const conteo: Record<EstadoSolicitud, number> = {
      Pendiente: 0,
      'En proceso': 0,
      Resuelto: 0,
    };

    for (const solicitud of this.registros()) {
      conteo[solicitud.estado]++;
    }

    return conteo;
  });

  readonly llamadas = this.servicio.llamadas;

  constructor() {
    // Historial de las 5 últimas consultas, la más reciente primero.
    // Se suscribe al texto que ya pasó por trim, debounce y distinct.
    this.consultas$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((texto) => {
      if (texto.length >= 2) {
        this.historial.update((historial) =>
          [texto, ...historial.filter((consulta) => consulta !== texto)].slice(0, 5),
        );
      }
    });
  }

  limpiar(): void {
    this.busqueda.setValue('');
    this.filtro.set('Todos');
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtro.set(filtro);
  }

  contarEstado(estado: FiltroEstado): number {
    if (estado === 'Todos') {
      return this.totalEncontrados();
    }

    return this.conteoEstados()[estado];
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

  private consultar(texto: string): Observable<Solicitud[]> {
    if (texto.length < 2) {
      this.buscando.set(false);
      return of([]);
    }

    this.haBuscado.set(true);
    this.buscando.set(true);
    return this.servicio.buscar(texto).pipe(finalize(() => this.buscando.set(false)));
  }
}
