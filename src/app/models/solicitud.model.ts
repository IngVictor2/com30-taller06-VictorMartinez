export type Categoria = 'Hardware' | 'Software' | 'Red' | 'Acceso' | 'Otro';

export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type EstadoSolicitud = 'Pendiente' | 'En proceso' | 'Resuelto';

export interface EquipoAfectado {
  codigo: string;
  ubicacion: string;
}

export interface Solicitud {
  id: number;
  codigo: string;
  solicitante: string;
  correo: string;
  categoria: Categoria;
  prioridad: Prioridad;
  impacto: string;
  fecha: string;
  descripcion: string;
  equipos: EquipoAfectado[];
  estado: EstadoSolicitud;
}
