import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SolicitudDetalle } from './solicitud-detalle';

describe('SolicitudDetalle', () => {
  let fixture: ComponentFixture<SolicitudDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudDetalle],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudDetalle);
    fixture.componentRef.setInput('id', 'R05');
    fixture.detectChanges();
  });

  it('muestra el registro R05 y la URL de la vista', () => {
    const texto = fixture.nativeElement.textContent as string;

    expect(texto).toContain('Diana Ruiz');
    expect(texto).toContain('Software');
    expect(texto).toContain('/solicitudes/R05');
    expect(texto).toContain('Resuelto');
  });

  it('actualiza el registro cuando cambia el input id, sin recrear el componente', () => {
    fixture.componentRef.setInput('id', 'R06');
    fixture.detectChanges();

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Jorge Díaz');
    expect(texto).toContain('/solicitudes/R06');
  });

  it('con un código inexistente muestra el mensaje dentro del detalle', () => {
    fixture.componentRef.setInput('id', 'R99');
    fixture.detectChanges();

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('No existe la solicitud R99');
    expect(texto).toContain('vista de detalle, no la página 404');
  });
});
