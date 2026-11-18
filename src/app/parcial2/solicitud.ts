import { BusquedaParcial } from './busqueda';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CODIGO, M, TOPE, hastaMayor, multiplo } from './validadores';

@Component({
  selector: 'app-parcial-solicitud',
  imports: [ReactiveFormsModule, BusquedaParcial],
  templateUrl: './solicitud.html',
})
export class SolicitudParcial {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly m = M;
  readonly tope = TOPE;
  readonly formulario = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(CODIGO)]],
    cantidad: ['', [Validators.required, Validators.min(1), Validators.max(TOPE), multiplo]],
    desde: ['10', [Validators.required, Validators.pattern(/^-?\d+$/)]],
    hasta: ['11', [Validators.required, Validators.pattern(/^-?\d+$/)]],
  }, { validators: hastaMayor });
  readonly campos = this.formulario.controls;

  enviar() {
    this.formulario.markAllAsTouched();
  }
}
