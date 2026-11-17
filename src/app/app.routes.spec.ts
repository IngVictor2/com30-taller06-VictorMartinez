import { routes } from './app.routes';

describe('app.routes', () => {
  it('redirige la ruta vacía y deja el comodín al final', () => {
    expect(routes[0]).toMatchObject({ path: '', redirectTo: 'solicitudes', pathMatch: 'full' });
    expect(routes.at(-1)?.path).toBe('**');
  });

  it('tiene las cinco vistas con title', () => {
    const conTitulo = routes.filter((ruta) => ruta.title);

    expect(conTitulo.map((ruta) => ruta.path)).toEqual([
      'solicitudes',
      'solicitudes/nueva',
      'solicitudes/:id',
      'estadisticas',
      '**',
    ]);
  });

  it('ubica solicitudes/nueva antes de solicitudes/:id', () => {
    const paths = routes.map((ruta) => ruta.path);

    expect(paths.indexOf('solicitudes/nueva')).toBeLessThan(paths.indexOf('solicitudes/:id'));
  });

  it('carga las estadísticas con loadComponent', () => {
    const estadisticas = routes.find((ruta) => ruta.path === 'estadisticas');

    expect(estadisticas?.loadComponent).toBeTypeOf('function');
    expect(estadisticas?.component).toBeUndefined();
  });
});
