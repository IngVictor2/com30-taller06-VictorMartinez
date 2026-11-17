import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { SolicitudForm } from './solicitud-form';

describe('SolicitudForm', () => {
  let fixture: ComponentFixture<SolicitudForm>;
  let componente: SolicitudForm;
  let router: Router;
  let servicio: SolicitudService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudForm);
    componente = fixture.componentInstance;
    router = TestBed.inject(Router);
    servicio = TestBed.inject(SolicitudService);
    fixture.detectChanges();
  });

  it('no navega si el formulario es inválido', () => {
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    componente.enviar();

    expect(navegar).not.toHaveBeenCalled();
  });

  it('al guardar un alta válida navega al detalle del registro creado', () => {
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    componente.form.setValue({
      solicitante: 'Prueba Usuario',
      correo: 'prueba@unibarranquilla.edu.co',
      categoria: 'Software',
      prioridad: 'Media',
      impacto: 'Sin acceso al aplicativo',
      fecha: '2026-11-16',
      descripcion: 'Descripción válida para la prueba de navegación.',
      equipos: [{ codigo: 'PC-9999', ubicacion: 'Bloque A, piso 1' }],
    });

    componente.enviar();

    expect(servicio.total()).toBe(13);
    expect(servicio.solicitudes().at(-1)?.codigo).toBe('R13');
    expect(navegar).toHaveBeenCalledWith(['/solicitudes', 'R13']);
  });
});
