import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaSolicitudes } from './busqueda-solicitudes';

describe('BusquedaSolicitudes', () => {
  let fixture: ComponentFixture<BusquedaSolicitudes>;
  let componente: BusquedaSolicitudes;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaSolicitudes],
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedaSolicitudes);
    componente = fixture.componentInstance;
    fixture.detectChanges();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra el mensaje de mínimo al inicio', () => {
    expect(fixture.nativeElement.textContent).toContain('Escriba al menos 2 caracteres');
  });

  it('busca "red" y muestra las 7 filas esperadas', async () => {
    componente.busqueda.setValue('red');
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(componente.buscando()).toBe(true);

    await vi.advanceTimersByTimeAsync(600);
    fixture.detectChanges();

    expect(componente.registros().length).toBe(7);
    expect(componente.llamadas()).toBe(1);

    const filas = fixture.nativeElement.querySelectorAll('.tabla-resultados tbody tr .codigo');
    expect(filas.length).toBe(7);
  });

  it('cambia el filtro sin generar llamadas nuevas', async () => {
    componente.busqueda.setValue('red');
    await vi.advanceTimersByTimeAsync(900);
    fixture.detectChanges();

    const llamadasAntes = componente.llamadas();
    componente.cambiarFiltro('Pendiente');
    fixture.detectChanges();

    expect(componente.visibles().length).toBe(2);
    expect(componente.llamadas()).toBe(llamadasAntes);
  });

  it('muestra @empty cuando la palabra no existe', async () => {
    componente.busqueda.setValue('zzz');
    await vi.advanceTimersByTimeAsync(900);
    fixture.detectChanges();

    expect(componente.registros().length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Sin coincidencias');
  });
});
