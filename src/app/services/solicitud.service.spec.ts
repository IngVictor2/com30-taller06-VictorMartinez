import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';

describe('SolicitudService', () => {
  let servicio: SolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(SolicitudService);
  });

  it('inicia con tres registros y un pendiente', () => {
    expect(servicio.total()).toBe(3);
    expect(servicio.pendientes()).toBe(1);
  });

  it('agrega un registro en estado Pendiente con un arreglo nuevo', () => {
    const antes = servicio.solicitudes();

    servicio.agregar({
      solicitante: 'Prueba',
      correo: 'prueba@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Prueba de registro',
      fecha: '2026-11-03',
      descripcion: 'Registro creado desde la prueba unitaria.',
      equipos: [{ codigo: 'PC-9001', ubicacion: 'Laboratorio' }],
    });

    const despues = servicio.solicitudes();

    expect(despues).not.toBe(antes);
    expect(despues.length).toBe(antes.length + 1);
    expect(despues.at(-1)?.estado).toBe('Pendiente');
  });

  it('cambia el estado de un registro', () => {
    servicio.cambiarEstado(1, 'Resuelto');

    expect(servicio.solicitudes().find((solicitud) => solicitud.id === 1)?.estado).toBe('Resuelto');
    expect(servicio.pendientes()).toBe(0);
  });

  it('elimina un registro sin mutar el arreglo anterior', () => {
    const antes = servicio.solicitudes();

    servicio.eliminar(1);

    expect(servicio.solicitudes()).not.toBe(antes);
    expect(servicio.total()).toBe(2);
  });
});
