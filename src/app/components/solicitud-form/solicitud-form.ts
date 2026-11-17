import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categoria, Prioridad } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import {
  impactoRequerido,
  minimoItems,
  sinSoloEspacios,
} from '../../validators/solicitud.validators';

type EquipoForm = FormGroup<{
  codigo: FormControl<string>;
  ubicacion: FormControl<string>;
}>;

@Component({
  selector: 'app-solicitud-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-form.html',
  styleUrl: './solicitud-form.css',
})
export class SolicitudForm {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(SolicitudService);
  private readonly router = inject(Router);

  readonly categorias: Categoria[] = ['Hardware', 'Software', 'Red', 'Acceso', 'Otro'];
  readonly prioridades: Prioridad[] = ['Baja', 'Media', 'Alta', 'Crítica'];

  // Modelo del formulario: FormBuilder nonNullable, 7 controles de cabecera + FormArray.
  readonly form = this.fb.nonNullable.group(
    {
      solicitante: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios]],
      correo: ['', [Validators.required, Validators.email]],
      categoria: ['', Validators.required],
      prioridad: ['Media', Validators.required],
      impacto: ['', Validators.minLength(5)],
      fecha: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      equipos: this.fb.array<EquipoForm>([], minimoItems(1)),
    },
    { validators: [impactoRequerido] },
  );

  constructor() {
    this.agregarEquipo();
  }

  get solicitante() {
    return this.form.controls.solicitante;
  }

  get correo() {
    return this.form.controls.correo;
  }

  get categoria() {
    return this.form.controls.categoria;
  }

  get prioridad() {
    return this.form.controls.prioridad;
  }

  get impacto() {
    return this.form.controls.impacto;
  }

  get fecha() {
    return this.form.controls.fecha;
  }

  get descripcion() {
    return this.form.controls.descripcion;
  }

  get equipos(): FormArray<EquipoForm> {
    return this.form.controls.equipos;
  }

  agregarEquipo(): void {
    this.equipos.push(this.crearEquipo());
  }

  quitarEquipo(indice: number): void {
    this.equipos.removeAt(indice);
    // Al quitar la última fila se muestra de inmediato el error del mínimo.
    this.equipos.markAsTouched();
    this.equipos.markAsDirty();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // getRawValue() entrega todos los valores del formulario, incluida la lista de ítems.
    const valor = this.form.getRawValue();

    const nueva = this.servicio.agregar({
      solicitante: valor.solicitante.trim(),
      correo: valor.correo.trim(),
      categoria: valor.categoria as Categoria,
      prioridad: valor.prioridad as Prioridad,
      impacto: valor.impacto.trim(),
      fecha: valor.fecha,
      descripcion: valor.descripcion.trim(),
      equipos: valor.equipos.map((equipo) => ({
        codigo: equipo.codigo.trim().toUpperCase(),
        ubicacion: equipo.ubicacion.trim(),
      })),
    });

    this.form.reset();
    this.equipos.clear();
    this.agregarEquipo();

    // Navegación programática al detalle del registro recién creado.
    void this.router.navigate(['/solicitudes', nueva.codigo]);
  }

  limpiar(): void {
    this.form.reset();
    this.equipos.clear();
    this.agregarEquipo();
  }

  private crearEquipo(): EquipoForm {
    return this.fb.nonNullable.group({
      codigo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,4}-\d{3,4}$/)]],
      ubicacion: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios]],
    });
  }
}
