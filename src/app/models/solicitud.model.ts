export type Categoria = 'Hardware' | 'Software' | 'Red' | 'Acceso' | 'Otro';

export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type EstadoSolicitud = 'Pendiente' | 'En proceso' | 'Resuelto';

/** Equipo afectado por una solicitud. Cada elemento del FormArray se convierte en uno de estos. */
export interface EquipoAfectado {
  codigo: string;
  ubicacion: string;
}

/** Modelo de datos que guarda el servicio. No es el modelo del formulario. */
export interface Solicitud {
  id: number;
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
