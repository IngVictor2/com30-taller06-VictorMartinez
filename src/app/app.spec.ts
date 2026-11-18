import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the help desk title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Mesa de Ayuda TI');
  });

  it('tiene un solo router-outlet y un menú con cinco enlaces', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = compiled.querySelector('.menu');

    expect(compiled.querySelectorAll('router-outlet').length).toBe(1);
    expect(menu?.querySelectorAll('a').length).toBe(5);
    expect(menu?.querySelector('a[href="/parcial2"]')).toBeTruthy();
    expect(menu?.textContent).toContain('Solicitudes');
    expect(menu?.textContent).toContain('Estadísticas');
  });
});
