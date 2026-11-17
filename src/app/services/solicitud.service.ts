import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { EstadoSolicitud, Solicitud } from '../models/solicitud.model';

export type NuevaSolicitud = Omit<Solicitud, 'id' | 'codigo' | 'estado'>;

/**
 * Servicio del Taller 06 ampliado para los talleres 07 y 08.
 * La búsqueda compara el texto normalizado con los campos `solicitante` e `impacto`.
 * Cada registro recibe un código legible (R01, R02…) que se usa en la ruta de detalle.
 */
@Injectable({ providedIn: 'root' })
export class SolicitudService {
  // La signal es privada: los componentes solo pueden leerla mediante asReadonly().
  private readonly solicitudesState = signal<Solicitud[]>([
    {
      id: 1,
      codigo: 'R01',
      solicitante: 'Ana Pérez',
      correo: 'ana.perez@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Red del bloque A sin conexión',
      fecha: '2026-11-01',
      descripcion: 'El equipo de la oficina 101 no accede a la red institucional desde la mañana.',
      equipos: [{ codigo: 'PC-1001', ubicacion: 'Bloque A, piso 1' }],
      estado: 'Pendiente',
    },
    {
      id: 2,
      codigo: 'R02',
      solicitante: 'Carlos Rojas',
      correo: 'carlos.rojas@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Media',
      impacto: 'Redes del bloque B intermitentes',
      fecha: '2026-11-02',
      descripcion: 'La conexión de la sala de profesores se cae cada pocos minutos.',
      equipos: [{ codigo: 'PC-2002', ubicacion: 'Bloque B, piso 2' }],
      estado: 'En proceso',
    },
    {
      id: 3,
      codigo: 'R03',
      solicitante: 'María Gómez',
      correo: 'maria.gomez@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Baja',
      impacto: 'Red lenta en biblioteca',
      fecha: '2026-11-03',
      descripcion: 'La navegación en los equipos de consulta es muy lenta.',
      equipos: [{ codigo: 'PC-3003', ubicacion: 'Biblioteca, piso 1' }],
      estado: 'Resuelto',
    },
    {
      id: 4,
      codigo: 'R04',
      solicitante: 'Luis Torres',
      correo: 'luis.torres@unibarranquilla.edu.co',
      categoria: 'Hardware',
      prioridad: 'Alta',
      impacto: 'Sistema del laboratorio sin acceso',
      fecha: '2026-11-04',
      descripcion: 'El equipo del laboratorio 3 no inicia el sistema operativo.',
      equipos: [{ codigo: 'PC-4004', ubicacion: 'Laboratorio 3' }],
      estado: 'Pendiente',
    },
    {
      id: 5,
      codigo: 'R05',
      solicitante: 'Diana Ruiz',
      correo: 'diana.ruiz@unibarranquilla.edu.co',
      categoria: 'Software',
      prioridad: 'Media',
      impacto: 'Sistema de facturación lento',
      fecha: '2026-11-05',
      descripcion: 'El aplicativo de facturación tarda en cargar los módulos.',
      equipos: [{ codigo: 'PC-5005', ubicacion: 'Tesorería, piso 2' }],
      estado: 'Resuelto',
    },
    {
      id: 6,
      codigo: 'R06',
      solicitante: 'Jorge Díaz',
      correo: 'jorge.diaz@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Crítica',
      impacto: 'Red caída en tesorería',
      fecha: '2026-11-06',
      descripcion: 'La oficina de tesorería quedó sin conectividad después del corte.',
      equipos: [{ codigo: 'PC-6006', ubicacion: 'Tesorería, piso 2' }],
      estado: 'Pendiente',
    },
    {
      id: 7,
      codigo: 'R07',
      solicitante: 'Laura Méndez',
      correo: 'laura.mendez@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Redes y sistema del laboratorio',
      fecha: '2026-11-07',
      descripcion: 'Los equipos del laboratorio no se conectan a las redes internas.',
      equipos: [{ codigo: 'PC-7007', ubicacion: 'Laboratorio 1' }],
      estado: 'En proceso',
    },
    {
      id: 8,
      codigo: 'R08',
      solicitante: 'Andrés Silva',
      correo: 'andres.silva@unibarranquilla.edu.co',
      categoria: 'Software',
      prioridad: 'Media',
      impacto: 'Correo institucional no sincroniza',
      fecha: '2026-11-08',
      descripcion: 'El correo no recibe mensajes nuevos desde ayer.',
      equipos: [{ codigo: 'PC-8008', ubicacion: 'Administración, piso 1' }],
      estado: 'Resuelto',
    },
    {
      id: 9,
      codigo: 'R09',
      solicitante: 'Paula Cárdenas',
      correo: 'paula.cardenas@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Baja',
      impacto: 'Red inalámbrica sin señal',
      fecha: '2026-11-09',
      descripcion: 'El portátil no detecta la red inalámbrica del bloque C.',
      equipos: [{ codigo: 'PORT-9009', ubicacion: 'Bloque C, piso 3' }],
      estado: 'Resuelto',
    },
    {
      id: 10,
      codigo: 'R10',
      solicitante: 'Sergio Navarro',
      correo: 'sergio.navarro@unibarranquilla.edu.co',
      categoria: 'Hardware',
      prioridad: 'Baja',
      impacto: 'Impresora del aula 302 sin tóner',
      fecha: '2026-11-10',
      descripcion: 'La impresora muestra el aviso de tóner agotado.',
      equipos: [{ codigo: 'IMP-1010', ubicacion: 'Aula 302' }],
      estado: 'En proceso',
    },
    {
      id: 11,
      codigo: 'R11',
      solicitante: 'Camila Herrera',
      correo: 'camila.herrera@unibarranquilla.edu.co',
      categoria: 'Software',
      prioridad: 'Alta',
      impacto: 'Sistema de nómina sin acceso',
      fecha: '2026-11-11',
      descripcion: 'El área de nómina no puede ingresar al sistema.',
      equipos: [{ codigo: 'PC-1111', ubicacion: 'Nómina, piso 2' }],
      estado: 'Pendiente',
    },
    {
      id: 12,
      codigo: 'R12',
      solicitante: 'Felipe Ortiz',
      correo: 'felipe.ortiz@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Crítica',
      impacto: 'Redes del laboratorio sin internet',
      fecha: '2026-11-12',
      descripcion: 'Los equipos del laboratorio 2 no tienen salida a internet.',
      equipos: [{ codigo: 'PC-1212', ubicacion: 'Laboratorio 2' }],
      estado: 'En proceso',
    },
  ]);

  private nextId = 13;

  /** Signal privada del contador de consultas; se expone como solo lectura. */
  private readonly llamadasState = signal(0);

  /** Versión pública de solo lectura de la signal. */
  readonly solicitudes = this.solicitudesState.asReadonly();

  /** Número de veces que se ha ejecutado buscar(). */
  readonly llamadas = this.llamadasState.asReadonly();

  readonly total = computed(() => this.solicitudesState().length);

  readonly pendientes = computed(
    () => this.solicitudesState().filter((solicitud) => solicitud.estado === 'Pendiente').length,
  );

  /**
   * Busca el texto recortado en `solicitante` e `impacto`.
   * No distingue mayúsculas ni tildes. Aplica el retardo de la condición 4.
   */
  buscar(texto: string): Observable<Solicitud[]> {
    const termino = this.normalizar(texto.trim());

    // El componente ya evita consultar con menos de 2 caracteres; se refuerza aquí.
    if (termino.length < 2) {
      return of([]);
    }

    this.llamadasState.update((totalLlamadas) => totalLlamadas + 1);

    const retardo = Math.max(150, 1500 - 300 * termino.length);
    const resultado = this.solicitudesState().filter((solicitud) => {
      return (
        this.normalizar(solicitud.solicitante).includes(termino) ||
        this.normalizar(solicitud.impacto).includes(termino)
      );
    });

    return of(resultado).pipe(delay(retardo));
  }

  /** Agrega un registro creando un arreglo nuevo (sin push ni splice). */
  agregar(datos: NuevaSolicitud): Solicitud {
    const id = this.nextId++;
    const nueva: Solicitud = {
      ...datos,
      id,
      codigo: `R${String(id).padStart(2, '0')}`,
      estado: 'Pendiente',
    };

    this.solicitudesState.update((solicitudes) => [...solicitudes, nueva]);
    return nueva;
  }

  /** Cambia el estado de un registro creando un arreglo nuevo. */
  cambiarEstado(id: number, estado: EstadoSolicitud): void {
    this.solicitudesState.update((solicitudes) =>
      solicitudes.map((solicitud) => (solicitud.id === id ? { ...solicitud, estado } : solicitud)),
    );
  }

  /** Elimina un registro creando un arreglo nuevo (sin splice). */
  eliminar(id: number): void {
    this.solicitudesState.update((solicitudes) =>
      solicitudes.filter((solicitud) => solicitud.id !== id),
    );
  }

  /** Minúsculas y sin tildes para comparar de forma sencilla. */
  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
