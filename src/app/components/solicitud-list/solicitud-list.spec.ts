import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SolicitudList } from './solicitud-list';

describe('SolicitudList', () => {
  let fixture: ComponentFixture<SolicitudList>;
  let componente: SolicitudList;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudList);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sin parámetro de consulta muestra los 12 registros', () => {
    expect(componente.filtroActual()).toBe('Todos');
    expect(componente.visibles().length).toBe(12);
    expect(fixture.nativeElement.querySelectorAll('.registro').length).toBe(12);
  });

  it('con estado Pendiente muestra 4 registros', () => {
    fixture.componentRef.setInput('estado', 'Pendiente');
    fixture.detectChanges();

    expect(componente.filtroActual()).toBe('Pendiente');
    expect(componente.visibles().length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('.registro').length).toBe(4);
    expect(fixture.nativeElement.textContent).toContain('R01');
    expect(fixture.nativeElement.textContent).toContain('R11');
  });

  it('con un estado sin registros muestra el mensaje de @empty', () => {
    fixture.componentRef.setInput('estado', 'Cancelado');
    fixture.detectChanges();

    expect(componente.visibles().length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('0 solicitudes con estado «Cancelado»');
  });

  it('genera enlaces de detalle con el código del registro', () => {
    const enlace = fixture.nativeElement.querySelector('a.codigo-enlace') as HTMLAnchorElement;

    expect(enlace.getAttribute('href')).toBe('/solicitudes/R01');
    expect(enlace.textContent).toContain('R01');
  });
});
