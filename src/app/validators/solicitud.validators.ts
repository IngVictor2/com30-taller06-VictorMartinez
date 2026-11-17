import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function sinSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (typeof valor === 'string' && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
}

export function impactoRequerido(group: AbstractControl): ValidationErrors | null {
  const prioridad = group.get('prioridad')?.value;
  const impacto = String(group.get('impacto')?.value ?? '').trim();

  if (prioridad === 'Crítica' && impacto.length === 0) {
    return { impactoRequerido: true };
  }

  return null;
}

export function minimoItems(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const items = control as FormArray;

    if (items.length < minimo) {
      return { minimoItems: { requerido: minimo, actual: items.length } };
    }

    return null;
  };
}
