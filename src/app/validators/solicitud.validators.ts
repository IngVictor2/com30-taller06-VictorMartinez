import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador propio de control.
 * Validators.required acepta una cadena de espacios porque su longitud es mayor que cero.
 * Este validador rechaza los valores que, después de trim(), quedan vacíos.
 */
export function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
}

/**
 * Validador de grupo.
 * Compara prioridad e impacto: si la prioridad es Crítica, el impacto no puede estar vacío.
 */
export function impactoRequerido(group: AbstractControl): ValidationErrors | null {
  const prioridad = group.get('prioridad')?.value;
  const impacto = String(group.get('impacto')?.value ?? '').trim();

  if (prioridad === 'Crítica' && impacto.length === 0) {
    return { impactoRequerido: true };
  }

  return null;
}

/** Validador propio del FormArray: exige un número mínimo de filas. */
export function minimoItems(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const items = control as FormArray;

    if (items.length < minimo) {
      return { minimoItems: { requerido: minimo, actual: items.length } };
    }

    return null;
  };
}
