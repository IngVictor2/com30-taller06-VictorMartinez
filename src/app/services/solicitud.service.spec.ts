import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Solicitud } from '../models/solicitud.model';
import { SolicitudService } from './solicitud.service';

describe('SolicitudService', () => {
  let servicio: SolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(SolicitudService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia con 12 registros, 3 estados y 4 pendientes', () => {
    expect(servicio.total()).toBe(12);
    expect(servicio.pendientes()).toBe(4);
    expect(new Set(servicio.solicitudes().map((solicitud) => solicitud.estado)).size).toBe(3);
  });

  it('busca "red" con el retardo de la condición 4 y cuenta una llamada', async () => {
    let resuelto = false;
    const promesa = firstValueFrom(servicio.buscar('red')).then((registros) => {
      resuelto = true;
      return registros;
    });

    expect(servicio.llamadas()).toBe(1);
    await vi.advanceTimersByTimeAsync(599);
    expect(resuelto).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    const resultado = await promesa;
    expect(resultado.map((solicitud) => solicitud.id)).toEqual([1, 2, 3, 6, 7, 9, 12]);
  });

  it('busca "redes" y devuelve los tres registros que comparten la palabra', async () => {
    const promesa = firstValueFrom(servicio.buscar('redes'));
    await vi.advanceTimersByTimeAsync(150);

    const resultado = await promesa;
    expect(resultado.map((solicitud) => solicitud.id)).toEqual([2, 7, 12]);
  });

  it('busca "sist" y devuelve cuatro registros', async () => {
    const promesa = firstValueFrom(servicio.buscar('sist'));
    await vi.advanceTimersByTimeAsync(300);

    const resultado = await promesa;
    expect(resultado.map((solicitud) => solicitud.id)).toEqual([4, 5, 7, 11]);
  });

  it('busca "laboratorio" y devuelve tres registros', async () => {
    const promesa = firstValueFrom(servicio.buscar('laboratorio'));
    await vi.advanceTimersByTimeAsync(150);

    const resultado = await promesa;
    expect(resultado.map((solicitud) => solicitud.id)).toEqual([4, 7, 12]);
  });

  it('devuelve vacío para una palabra que no existe', async () => {
    const promesa = firstValueFrom(servicio.buscar('zzz'));
    await vi.advanceTimersByTimeAsync(600);

    const resultado = await promesa;
    expect(resultado).toEqual([]);
    expect(servicio.llamadas()).toBe(1);
  });

  it('no consulta ni cuenta llamadas con menos de 2 caracteres', async () => {
    const resultado = await firstValueFrom(servicio.buscar('x'));

    expect(resultado).toEqual([]);
    expect(servicio.llamadas()).toBe(0);
  });

  it('normaliza mayúsculas y tildes', async () => {
    const promesa = firstValueFrom(servicio.buscar('CONEXION'));
    await vi.advanceTimersByTimeAsync(150);

    const resultado = await promesa;
    expect(resultado.map((solicitud) => solicitud.id)).toEqual([1]);
  });

  it('acumula el contador de llamadas', async () => {
    const primera = firstValueFrom(servicio.buscar('red'));
    await vi.advanceTimersByTimeAsync(600);
    await primera;

    const segunda = firstValueFrom(servicio.buscar('redes'));
    await vi.advanceTimersByTimeAsync(150);
    await segunda;

    expect(servicio.llamadas()).toBe(2);
  });

  it('agrega un registro en estado Pendiente con un arreglo nuevo', () => {
    const antes = servicio.solicitudes();

    servicio.agregar({
      solicitante: 'Prueba',
      correo: 'prueba@unibarranquilla.edu.co',
      categoria: 'Red',
      prioridad: 'Alta',
      impacto: 'Prueba de registro',
      fecha: '2026-11-10',
      descripcion: 'Registro creado desde la prueba unitaria.',
      equipos: [{ codigo: 'PC-9001', ubicacion: 'Laboratorio' }],
    });

    const despues = servicio.solicitudes();

    expect(despues).not.toBe(antes);
    expect(despues.length).toBe(antes.length + 1);
    expect(despues.at(-1)?.id).toBe(13);
    expect(despues.at(-1)?.estado).toBe('Pendiente');
  });

  it('cambia el estado de un registro', () => {
    servicio.cambiarEstado(1, 'Resuelto');

    expect(servicio.solicitudes().find((solicitud) => solicitud.id === 1)?.estado).toBe('Resuelto');
    expect(servicio.pendientes()).toBe(3);
  });

  it('elimina un registro sin mutar el arreglo anterior', () => {
    const antes = servicio.solicitudes();

    servicio.eliminar(1);

    expect(servicio.solicitudes()).not.toBe(antes);
    expect(servicio.total()).toBe(11);
  });
});
