import { DetalleParcial } from './parcial2/detalle';
import { SolicitudParcial } from './parcial2/solicitud';
import { Routes } from '@angular/router';
import { NoEncontrada } from './components/no-encontrada/no-encontrada';
import { SolicitudDetalle } from './components/solicitud-detalle/solicitud-detalle';
import { SolicitudForm } from './components/solicitud-form/solicitud-form';
import { SolicitudList } from './components/solicitud-list/solicitud-list';

export const routes: Routes = [
  { path: 'parcial2/detalle/:codigo', component: DetalleParcial },
  { path: 'parcial2', component: SolicitudParcial },
  { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
  {
    path: 'solicitudes',
    component: SolicitudList,
    title: 'Solicitudes · Mesa de Ayuda TI',
  },
  {
    path: 'solicitudes/nueva',
    component: SolicitudForm,
    title: 'Nueva solicitud · Mesa de Ayuda TI',
  },
  {
    path: 'solicitudes/:id',
    component: SolicitudDetalle,
    title: 'Detalle de solicitud · Mesa de Ayuda TI',
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas · Mesa de Ayuda TI',
    loadComponent: () =>
      import('./components/estadisticas/estadisticas').then((modulo) => modulo.Estadisticas),
  },
  {
    path: '**',
    component: NoEncontrada,
    title: 'Página no encontrada · Mesa de Ayuda TI',
  },
];
