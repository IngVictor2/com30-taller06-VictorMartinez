import { Injectable, computed, signal } from '@angular/core';
import { EstadoSolicitud, Solicitud } from '../models/solicitud.model';

export type NuevaSolicitud = Omit<Solicitud, 'id' | 'estado'>;

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  // La signal es privada: los componentes solo pueden leerla mediante asReadonly().
  private readonly solicitudesState = signal<Solicitud[]>([
    {
      id: 1,
      solicitante: 'Ana Pérez',
      correo: 'ana.perez@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Sin conexión en el bloque B',
      fecha: '2026-11-02',
      descripcion: 'El equipo no tiene acceso a la red institucional desde la mañana.',
      equipos: [{ codigo: 'PC-1024', ubicacion: 'Bloque B, piso 2' }],
      estado: 'Pendiente',
    },
    {
      id: 2,
      solicitante: 'Carlos Rojas',
      correo: 'carlos.rojas@unibarranquilla.edu.co',
      categoria: 'Software',
      prioridad: 'Media',
      impacto: 'Licencia de office vencida',
      fecha: '2026-11-01',
      descripcion: 'La suite de oficina solicita activación al abrir cualquier documento.',
      equipos: [{ codigo: 'PC-2048', ubicacion: 'Laboratorio 3' }],
      estado: 'En proceso',
    },
    {
      id: 3,
      solicitante: 'Laura Gómez',
      correo: 'laura.gomez@unibarranquilla.edu.co',
      categoria: 'Hardware',
      prioridad: 'Baja',
      impacto: 'Teclado con teclas defectuosas',
      fecha: '2026-10-30',
      descripcion: 'El teclado presenta fallas en las teclas de la fila superior.',
      equipos: [{ codigo: 'PC-3072', ubicacion: 'Biblioteca, piso 1' }],
      estado: 'Resuelto',
    },
  ]);

  private nextId = 4;

  /** Versión pública de solo lectura de la signal. */
  readonly solicitudes = this.solicitudesState.asReadonly();

  readonly total = computed(() => this.solicitudesState().length);

  readonly pendientes = computed(
    () => this.solicitudesState().filter((solicitud) => solicitud.estado === 'Pendiente').length,
  );

  /** Agrega un registro creando un arreglo nuevo (sin push ni splice). */
  agregar(datos: NuevaSolicitud): void {
    const nueva: Solicitud = {
      ...datos,
      id: this.nextId++,
      estado: 'Pendiente',
    };

    this.solicitudesState.update((solicitudes) => [...solicitudes, nueva]);
  }

  /** Cambia el estado de un registro creando un arreglo nuevo. */
  cambiarEstado(id: number, estado: EstadoSolicitud): void {
    this.solicitudesState.update((solicitudes) =>
      solicitudes.map((solicitud) => (solicitud.id === id ? { ...solicitud, estado } : solicitud)),
    );
  }

  /** Elimina un registro creando un arreglo nuevo (sin splice). */
  eliminar(id: number): void {
    this.solicitudesState.update((solicitudes) => solicitudes.filter((solicitud) => solicitud.id !== id));
  }
}
